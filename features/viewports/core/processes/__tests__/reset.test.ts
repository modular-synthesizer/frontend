import { DEFAULT_VIEWPORT } from "../../shared/Constants"
import { resetViewport } from "../reset.process"
import { describe, expect, it } from "vitest"

describe("reset", () => {
  it("Resets the viewport if the viewport is not already reset", () => {
    const viewport = { position: { x: 10, y: 10 }, scale: 1.0 }
    expect(resetViewport(viewport)).toEqual({ viewport: DEFAULT_VIEWPORT, changed: true })
  })
  it("Does not reset the viewport if it's already at the origin", () => {
    expect(resetViewport(DEFAULT_VIEWPORT)).toEqual({ viewport: DEFAULT_VIEWPORT, changed: false })
  })
  it("Changes the X coordinates only", () => {
    const viewport = { position: { x: 10, y: 0 }, scale: 1.0 }
    expect(resetViewport(viewport)).toEqual({ viewport: DEFAULT_VIEWPORT, changed: true })
  })
  it("Changes the Y coordinates only", () => {
    const viewport = { position: { x: 0, y: 10 }, scale: 1.0 }
    expect(resetViewport(viewport)).toEqual({ viewport: DEFAULT_VIEWPORT, changed: true })
  })
  it("Changes the scale only", () => {
    const viewport = { position: { x: 0, y: 0 }, scale: 2.0 }
    expect(resetViewport(viewport)).toEqual({ viewport: DEFAULT_VIEWPORT, changed: true })
  })
  it("Works with a frozen viewport", () => {
    const viewport = Object.freeze({ position: Object.freeze({ x: 10, y: 10 }), scale: 2.0 })
    expect(resetViewport(viewport)).toEqual({ viewport: DEFAULT_VIEWPORT, changed: true })
  })
})