import { describe, expect, it } from "vitest";
import { isDefaultViewport, positionsDiffer, viewportsDiffer } from "../viewport";
import { DEFAULT_VIEWPORT } from "../Constants";

describe("positionsDiffer", () => {
  it("returns TRUE when the X coordinates differ", () => {
    expect(positionsDiffer({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(true)
  })
  it("returns TRUE when the Y coordinates differ", () => {
    expect(positionsDiffer({ x: 0, y: 0 }, { x: 0, y: 1 })).toBe(true)
  })
  it("returns FALSE when both coordinates are the same", () => {
    expect(positionsDiffer({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(false)
  })
})

describe("viewportsDiffer", () => {
  const viewport = { position: { x: 0, y: 0 }, scale: 1.0 }

  it("returns TRUE when the X coordinates differ", () => {
    expect(viewportsDiffer(viewport, { position: { x: 1, y: 0 }, scale: 1.0 })).toBe(true)
  })
  it("returns TRUE when the Y coordinates differ", () => {
    expect(viewportsDiffer(viewport, { position: { x: 0, y: 1 }, scale: 1.0 })).toBe(true)
  })
  it("returns TRUE when the scales differ", () => {
    expect(viewportsDiffer(viewport, { position: { x: 0, y: 0 }, scale: 2.0 })).toBe(true)
  })
  it("returns FALSE when both coordinates and scale are the same", () => {
    expect(viewportsDiffer(viewport, { position: { x: 0, y: 0 }, scale: 1.0 })).toBe(false)
  })
})

describe("isDefaultViewport", () => {
  it("returns TRUE when the viewport equals the default one", () => {
    expect(isDefaultViewport(DEFAULT_VIEWPORT)).toBe(true)
  })
  it("returns FALSE when X coordinate is different from the default one", () => {
    expect(isDefaultViewport({ position: { x: 1, y: 0 }, scale: 1.0 })).toBe(false)
  })
  it("returns FALSE when Y coordinate is different from the default one", () => {
    expect(isDefaultViewport({ position: { x: 0, y: 1 }, scale: 1.0 })).toBe(false)
  })
  it("returns FALSE when scale is different from the default one", () => {
    expect(isDefaultViewport({ position: { x: 0, y: 0 }, scale: 2.0 })).toBe(false)
  })
})