import { describe, expect, it } from "vitest"
import type { Cable, Connection } from "../../data/Cable.type"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import type { InputPort, OutputPort } from "../../data/Port.type"
import { removeCable } from "../removeCable.process"

const moduleId = toObjectId("module")

const output = (id: string): OutputPort => deepFreeze({ id: toObjectId(id), moduleId, index: 0, kind: "output", node: "out" })
const input = (id: string): InputPort => deepFreeze({ id: toObjectId(id), moduleId, index: 0, kind: "input", node: "in" })

const outA = output("out.a"), inA = input("in.a")
const outB = output("out.b"), inB = input("in.b")

const connection: Connection = deepFreeze({ origin: outA, destination: inA })

const pending: Cable = deepFreeze({ ...connection, id: null, color: "blue" })
const target: Cable = deepFreeze({ ...connection, id: toObjectId("target"), color: "green" })

describe("removeCable", () => {
  it("removes the cable from the list if it's found with an ID, and then sends a delete effect", () => {
    const differentPorts: Cable = deepFreeze({ origin: outB, destination: inB, color: "green", id: toObjectId("diff") })
    const sameOutput: Cable = deepFreeze({ origin: outA, destination: inB, color: "green", id: toObjectId("same") })
    const cables = deepFreeze([ differentPorts, target, sameOutput ])
    expect(removeCable(cables, connection)).toEqual({
      cables: [ differentPorts, sameOutput ], effects: [
        { type: "cables.audio.disconnect", connection },
        { type: "cables.cable.delete", id: target.id },
      ]
    })
  })

  it("does not send a delete effect for the cable if it's pending in the list", () => {
    const cables = deepFreeze([ pending ])
    expect(removeCable(cables, connection)).toEqual({
      cables: [], effects: [ { type: "cables.audio.disconnect", connection } ]
    })
  })

  it("does not trigger an effect if no cable matches both ports of the target in the list", () => {
    const differentPorts: Cable = deepFreeze({ origin: outB, destination: inB, color: "green", id: toObjectId("diff") })
    const sameOutput: Cable = deepFreeze({ origin: outA, destination: inB, color: "green", id: toObjectId("same") })
    const cables = deepFreeze([ differentPorts, sameOutput ])

    expect(removeCable(cables, connection)).toEqual({ cables, effects: [] })
  })

  it("keeps the other cables plugged into the same input (data prior to the migration)", () => {
    const sameInput: Cable = deepFreeze({ origin: outB, destination: inA, color: "green", id: toObjectId("same.input") })
    const cables = deepFreeze([ target, sameInput ])

    expect(removeCable(cables, connection)).toEqual({
      cables: [ sameInput ],
      effects: [
        { type: "cables.audio.disconnect", connection },
        { type: "cables.cable.delete", id: target.id },
      ]
    })
  })
})