import { describe, expect, it } from "vitest"
import type { Cable } from "../../data/Cable.type"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import type { InputPort, OutputPort } from "../../data/Port.type"
import { receiveRemoval } from "../receiveRemoval.process"

const moduleId = toObjectId("module")

const output = (id: string): OutputPort => deepFreeze({ id: toObjectId(id), moduleId, index: 0, kind: "output", node: "out" })
const input = (id: string): InputPort => deepFreeze({ id: toObjectId(id), moduleId, index: 0, kind: "input", node: "in" })

const outA = output("out.a"), inA = input("in.a")
const outB = output("out.b"), inB = input("in.b")

const target: Cable = deepFreeze({ origin: outA, destination: inA, id: toObjectId("target"), color: "green" })
const differentPorts: Cable = deepFreeze({ origin: outB, destination: inB, id: toObjectId("diff"), color: "blue" })
const sameOutput: Cable = deepFreeze({ origin: outA, destination: inB, id: toObjectId("same"), color: "red" })
const pending: Cable = deepFreeze({ origin: outB, destination: inA, id: null, color: "blue" })

describe("receiveRemoval", () => {
  it("removes the cable with the given ID, keeps the order of the others, and sends a disconnect effect", () => {
    const cables = deepFreeze([ differentPorts, target, sameOutput ])
    expect(receiveRemoval(cables, target.id!)).toEqual({
      cables: [ differentPorts, sameOutput ],
      effects: [ { type: "cables.audio.disconnect", connection: { origin: outA, destination: inA } } ]
    })
  })

  it("returns an empty list when the removed cable was the only one", () => {
    const cables = deepFreeze([ target ])
    expect(receiveRemoval(cables, target.id!)).toEqual({
      cables: [],
      effects: [ { type: "cables.audio.disconnect", connection: { origin: outA, destination: inA } } ]
    })
  })

  it("does not trigger any effect when no cable has the given ID", () => {
    const cables = deepFreeze([ differentPorts, sameOutput ])
    expect(receiveRemoval(cables, toObjectId("unknown"))).toEqual({ cables, effects: [] })
  })

  it("does not trigger any effect on an empty list", () => {
    expect(receiveRemoval(deepFreeze([]), target.id!)).toEqual({ cables: [], effects: [] })
  })

  it("keeps pending cables untouched", () => {
    const cables = deepFreeze([ pending, target ])
    expect(receiveRemoval(cables, target.id!)).toEqual({
      cables: [ pending ],
      effects: [ { type: "cables.audio.disconnect", connection: { origin: outA, destination: inA } } ]
    })
  })

  it("matches on the ID only, not on the ports", () => {
    const cables = deepFreeze([ target, sameOutput ])
    expect(receiveRemoval(cables, sameOutput.id!).cables).toEqual([ target ])
  })

  it("returns a new array, even when nothing is removed", () => {
    const cables = deepFreeze([ differentPorts ])
    expect(receiveRemoval(cables, toObjectId("unknown")).cables).not.toBe(cables)
  })
})
