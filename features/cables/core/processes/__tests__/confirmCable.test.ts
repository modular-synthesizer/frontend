import { describe, expect, it } from "vitest"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import { ko, ok } from "../../../../shared/results/result"
import type { InputPort, OutputPort } from "../../data/Port.type"
import type { Cable, Connection } from "../../data/Cable.type"
import { confirmCable } from "../confirmCable.process"

const moduleId = toObjectId("module")
const output = (id: string): OutputPort => deepFreeze({ id: toObjectId(id), moduleId, index: 0, kind: "output", node: "out" })
const input = (id: string): InputPort => deepFreeze({ id: toObjectId(id), moduleId, index: 0, kind: "input", node: "in" })

const outA = output("out.a"), inA = input("in.a")
const outB = output("out.b"), inB = input("in.b")

const created: Connection = deepFreeze({ origin: outA, destination: inA })
const id = toObjectId("cable.id")

const pending: Cable = deepFreeze({ ...created, id: null, color: "blue" })
const other: Cable = deepFreeze({ origin: outB, destination: inB, id: toObjectId("other"), color: "green" })

describe("confirmCable", () => {
  describe("on success", () => {
    it("gives the id to the pending cable, keeping its position and color, without effect", () => {
      const cables = deepFreeze([ pending, other ])

      expect(confirmCable(cables, created, ok(id))).toEqual({
        cables: [ { ...pending, id }, other ], effects: []
      })
    })
    it("changes nothing when the notification already identified the cable (no delete)", () => {
      const cables = deepFreeze([ { ...pending, id }, other ])

      expect(confirmCable(cables, created, ok(id))).toEqual({ cables, effects: [] })
    })
    it("deletes the cable on the server when it was removed during the request", () => {
      const cables = deepFreeze([ other ])

      expect(confirmCable(cables, created, ok(id))).toEqual({
        cables: [ other ], effects: [ { type: "cables.cable.delete", id } ]
      })
    })
    it("only identifies the pending cable with the same ports among several pending cables", () => {
      const otherPending: Cable = deepFreeze({ origin: outB, destination: inB, id: null, color: "yellow" })
      const cables = deepFreeze([ otherPending, pending ])

      expect(confirmCable(cables, created, ok(id))).toEqual({
        cables: [ otherPending, { ...pending, id } ], effects: []
      })
    })
    it("does not mistake a pending cable sharing only the input for the created one", () => {
      const sameInput: Cable = deepFreeze({ origin: outB, destination: inA, id: null, color: "yellow" })
      const cables = deepFreeze([ sameInput ])

      expect(confirmCable(cables, created, ok(id))).toEqual({
        cables: [ sameInput ], effects: [ { type: "cables.cable.delete", id } ]
      })
    })
  })
  describe("on failure", () => {
    it("removes the pending cable and disconnects it", () => {
      const cables = deepFreeze([ pending, other ])

      expect(confirmCable(cables, created, ko("http.error"))).toEqual({
        cables: [ other ], effects: [ { type: "cables.audio.disconnect", connection: created } ]
      })
    })
    it("changes nothing when the cable is not in the list", () => {
      const cables = deepFreeze([ other ])

      expect(confirmCable(cables, created, ko("http.error"))).toEqual({ cables: [ other ], effects: [] })
    })
    it("never removes a saved cable on the same ports", () => {
      const saved: Cable = deepFreeze({ ...created, id, color: "blue" })
      const cables = deepFreeze([ saved, other ])

      expect(confirmCable(cables, created, ko("http.error"))).toEqual({ cables: [ saved, other ], effects: [] })
    })
  })
})
