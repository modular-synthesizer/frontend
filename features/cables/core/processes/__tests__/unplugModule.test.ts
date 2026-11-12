import { describe, expect, it } from "vitest"
import type { Cable, Connection } from "../../data/Cable.type"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import { toObjectId, type ObjectId } from "../../../../shared/data/ObjectId.type"
import type { InputPort, OutputPort } from "../../data/Port.type"
import { unplugModule } from "../unplugModule.process"

const m = toObjectId("module.m")
const x = toObjectId("module.x")

const output = (id: string, moduleId: ObjectId): OutputPort =>
  deepFreeze({ id: toObjectId(id), moduleId, index: 0, kind: "output", node: "out" })
const input = (id: string, moduleId: ObjectId): InputPort =>
  deepFreeze({ id: toObjectId(id), moduleId, index: 0, kind: "input", node: "in" })

const mOut1 = output("m.out.1", m), mIn = input("m.in", m)
const xOut = output("x.out", x), xIn1 = input("x.in.1", x), xIn2 = input("x.in.2", x), xIn3 = input("x.in.3", x)

const cable = (origin: OutputPort, destination: InputPort, id: string | null): Cable =>
  deepFreeze({ origin, destination, id: id === null ? null : toObjectId(id), color: "green" })

const connectionOf = ({ origin, destination }: Cable): Connection => ({ origin, destination })
const disconnect = (c: Cable) => ({ type: "cables.audio.disconnect", connection: connectionOf(c) })
const remove = (c: Cable) => ({ type: "cables.cable.delete", id: c.id })

const xA = cable(xOut, xIn1, "x.a")
const xB = cable(xOut, xIn2, "x.b")

describe("unplugModule", () => {
  it("changes nothing when the list is empty", () => {
    expect(unplugModule(deepFreeze([]), m)).toEqual({ cables: [], effects: [] })
  })

  it("changes nothing when no cable touches the module", () => {
    const cables = deepFreeze([ xA, xB ])

    expect(unplugModule(cables, m)).toEqual({ cables, effects: [] })
  })

  it("removes every cable of the module, including several from the same output, keeping the order", () => {
    const m1 = cable(mOut1, xIn1, "m.1")
    const m2 = cable(mOut1, xIn2, "m.2")
    const m3 = cable(xOut, mIn, "m.3")
    const xC = cable(xOut, xIn3, "x.c")
    const cables = deepFreeze([ xA, m1, m2, xB, m3, xC ])

    expect(unplugModule(cables, m)).toEqual({
      cables: [ xA, xB, xC ],
      effects: [ disconnect(m1), remove(m1), disconnect(m2), remove(m2), disconnect(m3), remove(m3) ],
    })
  })

  it("removes a pending cable of the module without deleting it on the server", () => {
    const pending = cable(mOut1, xIn1, null)
    const cables = deepFreeze([ xA, pending, xB ])

    expect(unplugModule(cables, m)).toEqual({ cables: [ xA, xB ], effects: [ disconnect(pending) ] })
  })

  it("counts a cable from the module to itself only once", () => {
    const loop = cable(mOut1, mIn, "loop")
    const cables = deepFreeze([ xA, loop, xB ])

    expect(unplugModule(cables, m)).toEqual({ cables: [ xA, xB ], effects: [ disconnect(loop), remove(loop) ] })
  })

  it("removes a cable touching the module only by its input", () => {
    const incoming = cable(xOut, mIn, "incoming")
    const cables = deepFreeze([ xA, incoming ])

    expect(unplugModule(cables, m)).toEqual({ cables: [ xA ], effects: [ disconnect(incoming), remove(incoming) ] })
  })

  it("puts a bare connection, without id nor color, in the disconnect effect", () => {
    const m1 = cable(mOut1, xIn1, "m.1")
    const { effects } = unplugModule(deepFreeze([ m1 ]), m)

    expect(effects[0]).toEqual({ type: "cables.audio.disconnect", connection: { origin: mOut1, destination: xIn1 } })
  })
})
