import { describe, expect, it } from "vitest";
import type { Uuid } from "../../../../shared/data/Uuid.type";
import { pan } from "../pan.process";
import type { Viewport } from "../../../../viewports/core/data/Viewport.type";

const ID = "00000000-0000-0000-000000000000" as Uuid

function expectedEffect(viewport: Viewport) {
  return { type: "blueprints.viewport.save", id: ID, viewport }
}

const viewport = Object.freeze({ position: Object.freeze({ x: 0, y: 0 }), scale: 1.0 })

describe("pan", () => {
  it("does not trigger a save of the viewport if position has not changed", () => {
    const position = { x: 0, y: 0 }
    expect(pan(ID, viewport, position)).toEqual({
      viewport: { position, scale: 1.0 }, effects: []
    })
  })
  it("produces a save of the viewport when the position changes", () => {
    const position = { x: 10, y: 10 }
    expect(pan(ID, { ...viewport, scale: 2.0 }, position)).toEqual({
      viewport: { position, scale: 2.0 },
      effects: [ expectedEffect({ position, scale: 2.0 }) ]
    })
  })
  it("does not produce a viewport save if the ID is not given", () => {
    const position = { x: 10, y: 10 }
    expect(pan(null, { ...viewport, scale: 2.0 }, position)).toEqual({
      viewport: { position, scale: 2.0 }, effects: []
    })
  })
})
