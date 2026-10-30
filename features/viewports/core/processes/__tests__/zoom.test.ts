import { describe, expect, it } from "vitest"
import { zoomViewport } from "../zoom.process"
import { MAX_SCALE, MIN_SCALE } from "../../shared/Constants"

describe("zoomViewport", () => {
  it("produces a change if user zooms out", () => {
    const viewport = { position: { x: 0, y: 0 }, scale: 1.5 }
    expect(zoomViewport(viewport, 100)).toEqual({ viewport: { ...viewport, scale: 1.0 }, changed: true })
  })
  it("produces a change if user zooms in", () => {
    const viewport = { position: { x: 0, y: 0 }, scale: 0.5 }
    expect(zoomViewport(viewport, -100)).toEqual({ viewport: { ...viewport, scale: 1.0 }, changed: true })
  })
  it("does not produce a change if deltaY is zero", () => {
    const viewport = { position: { x: 0, y: 0 }, scale: 1.0 }
    expect(zoomViewport(viewport, 0)).toEqual({ viewport: { ...viewport, scale: 1.0 }, changed: false })
  })
  it("does produce a change if the value has been clamped when zooming out", () => {
    const viewport = { position: { x: 0, y: 0 }, scale: 1.0 }
    expect(zoomViewport(viewport, 1000)).toEqual({ viewport: { ...viewport, scale: 0.5 }, changed: true })
  })
  it("does produce a change if the value has been clamped when zooming in", () => {
    const viewport = { position: { x: 0, y: 0 }, scale: 1.0 }
    expect(zoomViewport(viewport, -1000)).toEqual({ viewport: { ...viewport, scale: 2.0 }, changed: true })
  })
  it("does not produce a change if the value is at min and the user zooms out", () => {
    const viewport = { position: { x: 0, y: 0 }, scale: MIN_SCALE }
    expect(zoomViewport(viewport, 400)).toEqual({ viewport, changed: false })
  })
  it("does not produce a change if the value is at max and the user zooms in", () => {
    const viewport = { position: { x: 0, y: 0 }, scale: MAX_SCALE }
    expect(zoomViewport(viewport, -400)).toEqual({ viewport, changed: false })
  })
  it("can handle a frozen object", () => {
    const viewport = Object.freeze({ position: Object.freeze({ x: 0, y: 0 }), scale: MAX_SCALE })
    expect(zoomViewport(viewport, 100)).toEqual({ viewport: { ...viewport, scale: 1.5 }, changed: true })
  })
  it("does not keep a reference to the origin position", () => {
    const position = { x: 10, y: 20 }
    const viewport = { position, scale: 1.0 }
    const result = zoomViewport(viewport, 100).viewport
    expect(result).not.toBe(viewport)
    expect(result.position).not.toBe(position)
    expect(result.position).toEqual(position)
  })
})