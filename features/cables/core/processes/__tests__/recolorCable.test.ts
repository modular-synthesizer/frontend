import { describe, expect, it } from "vitest"
import type { Cable, Connection } from "../../data/Cable.type"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import { recolorCable } from "../recolorCable.process"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"

describe("recolorCable", () => {
  const connection: Connection = deepFreeze({
    origin: { id: toObjectId("id.a"), moduleId: toObjectId("mod.a"), index: 6, node: "test.a", kind: "output" },
    destination: { id: toObjectId("id.b"), moduleId: toObjectId("mod.b"), index: 3, node: "test.b", kind: "input" },
  })
  it("changes the color of the cable without moving its position in the list", () => {
    const cables: Cable[] = deepFreeze([
      { ...connection, origin: { ...connection.origin, id: toObjectId("id.c") }, id: toObjectId("id.2"), color: "green" },
      { ...connection, destination: { ...connection.destination, id: toObjectId("id.d") }, id: toObjectId("id.3"), color: "red" },
      { ...connection, id: toObjectId("id"), color: "red" },
    ])
    expect(recolorCable(cables, connection, "blue")).toEqual({
      cables: [ cables[0], cables[1], { ...cables[2], color: "blue" } ],
      effects: [ { type: "cables.cable.save", id: toObjectId("id"), color: "blue" } ]
    })
  })
  it("does nothing for a pending cable as it should not change color", () => {
    const cable: Cable = deepFreeze({ ...connection, id: null, color: "red" })
    expect(recolorCable([ cable ], connection, "blue")).toEqual({
      cables: [ cable ], effects: []
    })
  })
  it("does nothing to a cable that already has the asked color", () => {
    const cable: Cable = deepFreeze({ ...connection, id: toObjectId("id"), color: "blue" })
    expect(recolorCable([ cable ], connection, "blue")).toEqual({
      cables: [ cable ], effects: []
    })
  })
  it("applies the decision on the created cable", () => {
    const cable: Cable = deepFreeze({ ...connection, id: null, color: "red" })
    const cables = deepFreeze([ { ...cable, id: toObjectId("test")} ])
    expect(recolorCable(cables, cable, "green")).toEqual({
      cables: [ { ...cable, id: toObjectId("test"), color: "green" } ],
      effects: [ { type: "cables.cable.save", id: toObjectId("test"), color: "green" } ]
    })
  })
  it("does nothing if the corresponding connection is not found in the list", () => {
    const cable: Cable = deepFreeze({
      origin: { id: toObjectId("other.a"), moduleId: toObjectId("otherMod.a"), index: 6, node: "test.a", kind: "output" },
      destination: { id: toObjectId("other.b"), moduleId: toObjectId("otherMod.b"), index: 3, node: "test.b", kind: "input" },
      id: toObjectId("test"),
      color: "green",
    })
    expect(recolorCable([ cable ], connection, "blue")).toEqual({
      cables: [ cable ], effects: []
    })
  })
})