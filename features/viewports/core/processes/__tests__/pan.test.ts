import { describe, expect, it } from "vitest";
import { panViewport } from "../pan.process";

const viewport = Object.freeze({ position: Object.freeze({ x: 0, y: 0 }), scale: 1.0 })

describe("pan", () => {
  it("changes the X coordinates only", () => {
    const position = { x: 10, y: 0 }
    expect(panViewport(viewport, position)).toEqual({
      viewport: { position, scale: 1.0 }, changed: true
    })
  })
  it("changes the Y coordinates only", () => {
    const position = { x: 0, y: 10 }
    expect(panViewport(viewport, position)).toEqual({
      viewport: { position, scale: 1.0 }, changed: true
    })
  })
  it("does not indicate a change of the viewport if position has not changed", () => {
    const position = { x: 0, y: 0 }
    expect(panViewport(viewport, position)).toEqual({
      viewport: { position, scale: 1.0 }, changed: false
    })
  })
  it("keeps the scale when modifying the coordinates", () => {
    const position = { x: 10, y: 10 }
    expect(panViewport({ ...viewport, scale: 2.0 }, position)).toEqual({
      viewport: { position, scale: 2.0 }, changed: true
    })
  })
  it("does not keep a reference to the live target position", () => {
    const to = { x: 10, y: 10 }
    expect(panViewport(viewport, to).viewport.position).not.toBe(to)
  })
})