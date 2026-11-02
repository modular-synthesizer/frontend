import { describe, expect, it } from "vitest";
import type { Uuid } from "../../../../shared/data/Uuid.type";
import { moveNode } from "../moveNode.process";

describe("moveNode", () => {
  const id = "test" as Uuid
  const blueprintId = "blueprint" as Uuid

  it("moves the node and saves it if it has moved and is linked to a blueprint", () => {
    expect(moveNode(blueprintId, id, { x: 0, y: 0 }, { x: 10, y: 20 })).toEqual({
      position: { x: 10, y: 20 }, effects: [
        { type: "blueprints.node.save", position: { x: 10, y: 20 }, id, blueprintId}
      ]
    })
  })
  it("moves the node and saves it if it has moved on the X axis only", () => {
    expect(moveNode(blueprintId, id, { x: 0, y: 0 }, { x: 10, y: 0 })).toEqual({
      position: { x: 10, y: 0 }, effects: [
        { type: "blueprints.node.save", position: { x: 10, y: 0 }, id, blueprintId}
      ]
    })
  })
  it("moves the node and saves it if it has moved on the Y axis only", () => {
    expect(moveNode(blueprintId, id, { x: 0, y: 0 }, { x: 0, y: 20 })).toEqual({
      position: { x: 0, y: 20 }, effects: [
        { type: "blueprints.node.save", position: { x: 0, y: 20 }, id, blueprintId}
      ]
    })
  })
  it("does not save the node if it has not moved", () => {
    expect(moveNode(blueprintId, id, { x: 0, y: 0 }, { x: 0, y: 0 })).toEqual({
      position: { x: 0, y: 0 }, effects: []
    })
  })
  it("does not save the node if it is not linked to a blueprint", () => {
    expect(moveNode(null, id, { x: 0, y: 0 }, { x: 10, y: 20 })).toEqual({
      position: { x: 10, y: 20 }, effects: []
    })
  })
})