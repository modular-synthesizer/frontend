import { describe, expect, it } from "vitest"
import type { Cable, Connection, SavedCable } from "../../data/Cable.type"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import { ok } from "../../../../shared/results/result"
import type { InputPort, OutputPort } from "../../data/Port.type"
import { receiveCable } from "../receiveCable.process"
import { confirmCable } from "../confirmCable.process"

const moduleId = toObjectId("module")

const output = (id: string): OutputPort => deepFreeze({ id: toObjectId(id), moduleId, index: 0, kind: "output", node: "out" })
const input = (id: string): InputPort => deepFreeze({ id: toObjectId(id), moduleId, index: 0, kind: "input", node: "in" })

const outA = output("out.a"), inA = input("in.a")
const outB = output("out.b"), inB = input("in.b")

const connection: Connection = deepFreeze({ origin: outA, destination: inA })

const incoming: SavedCable = deepFreeze({ ...connection, id: toObjectId("incoming"), color: "green" })
const pending: Cable = deepFreeze({ ...connection, id: null, color: "blue" })
const other: Cable = deepFreeze({ origin: outB, destination: inB, id: toObjectId("other"), color: "red" })

describe("receiveCable", () => {
  describe("when the connection is unknown", () => {
    it("adds the cable and connects the audio", () => {
      const cables = deepFreeze([ other ])
      expect(receiveCable(cables, incoming)).toEqual({
        cables: [ other, incoming ],
        effects: [ { type: "cables.audio.connect", connection } ]
      })
    })

    it("adds the cable in an empty list", () => {
      expect(receiveCable(deepFreeze([]), incoming)).toEqual({
        cables: [ incoming ],
        effects: [ { type: "cables.audio.connect", connection } ]
      })
    })

    it("does not leak the id or the color into the connect effect", () => {
      const { effects } = receiveCable(deepFreeze([]), incoming)
      expect(effects[0]).not.toHaveProperty("connection.id")
      expect(effects[0]).not.toHaveProperty("connection.color")
    })

    it("treats a cable sharing only one port as a different connection", () => {
      const sameOutput: Cable = deepFreeze({ origin: outA, destination: inB, id: toObjectId("same"), color: "red" })
      const cables = deepFreeze([ sameOutput ])
      expect(receiveCable(cables, incoming)).toEqual({
        cables: [ sameOutput, incoming ],
        effects: [ { type: "cables.audio.connect", connection } ]
      })
    })
  })

  describe("when the cable id is already known", () => {
    it("leaves the list unchanged without any effect", () => {
      const cables = deepFreeze([ other, incoming ])
      expect(receiveCable(cables, incoming)).toEqual({ cables, effects: [] })
    })

    it("is idempotent when the same notification is received twice", () => {
      const first = receiveCable(deepFreeze([]), incoming)
      const second = receiveCable(deepFreeze(first.cables), incoming)
      expect(second).toEqual({ cables: [ incoming ], effects: [] })
    })
  })

  describe("when a pending cable has the same connection", () => {
    it("identifies the pending cable with the incoming id and the existing color, without effect", () => {
      const cables = deepFreeze([ other, pending ])
      expect(receiveCable(cables, incoming)).toEqual({
        cables: [ other, { ...connection, id: incoming.id, color: pending.color } ],
        effects: []
      })
    })

    it("keeps the position of the pending cable in the list", () => {
      const cables = deepFreeze([ pending, other ])
      const { cables: result } = receiveCable(cables, incoming)
      expect(result.map(c => c.id)).toEqual([ incoming.id, other.id ])
    })
  })

  describe("when an identified cable has the same connection under another id", () => {
    it("does not add a duplicate nor connect twice", () => {
      const twin: Cable = deepFreeze({ ...connection, id: toObjectId("twin"), color: "yellow" })
      const cables = deepFreeze([ twin ])
      expect(receiveCable(cables, incoming)).toEqual({ cables, effects: [] })
    })
  })

  it("returns a new array instance", () => {
    const cables = deepFreeze([ incoming ])
    expect(receiveCable(cables, incoming).cables).not.toBe(cables)
  })

  describe("race with confirmCable", () => {
    it("response then notification: a single cable and no connect", () => {
      const confirmed = confirmCable(deepFreeze([ pending ]), connection, ok(incoming.id))
      const received = receiveCable(deepFreeze(confirmed.cables), incoming)
      expect(received.cables).toHaveLength(1)
      expect(received.effects).toEqual([])
    })

    it("notification then response: a single cable and no effect", () => {
      const received = receiveCable(deepFreeze([ pending ]), incoming)
      const confirmed = confirmCable(deepFreeze(received.cables), connection, ok(incoming.id))
      expect(confirmed.cables).toHaveLength(1)
      expect(received.effects).toEqual([])
      expect(confirmed.effects).toEqual([])
    })
  })
})
