import { describe, expect, it } from "vitest";
import type { Viewport } from "../../../data/Synthesizer.type";
import type { Uuid } from "../../../data/Uuid.type";
import { pan } from "../pan.process";

const ID = "00000000-0000-0000-000000000000" as Uuid

function expectedEffect(viewport: Viewport) {
  return { type: "synthesizers.viewport.save", id: ID, viewport }
}

const viewport = Object.freeze({ position: Object.freeze({ x: 0, y: 0 }), scale: 1.0 })

describe("pan", () => {
  it("changes the X coordinates only", () => {
    const position = { x: 10, y: 0 }
    expect(pan(ID, viewport, position)).toEqual({
      viewport: { position, scale: 1.0 },
      effects: [ expectedEffect({ position, scale: 1.0 }) ]
    })
  })
  it("changes the Y coordinates only", () => {
    const position = { x: 0, y: 10 }
    expect(pan(ID, viewport, position)).toEqual({
      viewport: { position, scale: 1.0 },
      effects: [ expectedEffect({ position, scale: 1.0 }) ]
    })
  })
  it("does not trigger a save of the viewport if position has not changed", () => {
    const position = { x: 0, y: 0 }
    expect(pan(ID, viewport, position)).toEqual({
      viewport: { position, scale: 1.0 },
      effects: [ ]
    })
  })
  it("keeps the scale when modifying the coordinates", () => {
    const position = { x: 10, y: 10 }
    expect(pan(ID, { ...viewport, scale: 2.0 }, position)).toEqual({
      viewport: { position, scale: 2.0 },
      effects: [ expectedEffect({ position, scale: 2.0 }) ]
    })
  })
  it("does not keep a reference to the live target position", () => {
    const to = { x: 10, y: 10 }
    expect(pan(ID, viewport, to).viewport.position).not.toBe(to)
  })
})