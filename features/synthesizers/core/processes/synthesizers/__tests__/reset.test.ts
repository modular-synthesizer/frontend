import { describe, expect, it } from "vitest";
import { reset } from "../reset.process";
import { DEFAULT_VIEWPORT } from "../../../shared/Constants";
import type { Viewport } from "../../../data/Synthesizer.type";
import type { Uuid } from "../../../data/Uuid.type";

const ID = "00000000-0000-0000-000000000000" as Uuid

function expectedEffect(viewport: Viewport) {
  return { type: "synthesizers.viewport.save", id: ID, viewport }
}

describe("reset", () => {
  it("Resets the viewport if the synthesizer is not already reset", () => {
    const viewport = { position: { x: 10, y: 10 }, scale: 1.0 }
    expect(reset(ID, viewport)).toEqual({ effects: [ expectedEffect(DEFAULT_VIEWPORT) ] })
  })
  it("Does not reset the viewport if it's already at the origin", () => {
    expect(reset(ID, DEFAULT_VIEWPORT)).toEqual({ effects: [] })
  })
  it("Changes the X coordinates only", () => {
    const viewport = { position: { x: 10, y: 0 }, scale: 1.0 }
    expect(reset(ID, viewport)).toEqual({ effects: [ expectedEffect(DEFAULT_VIEWPORT) ] })
  })
  it("Changes the Y coordinates only", () => {
    const viewport = { position: { x: 0, y: 10 }, scale: 1.0 }
    expect(reset(ID, viewport)).toEqual({ effects: [ expectedEffect(DEFAULT_VIEWPORT) ] })
  })
  it("Changes the scale only", () => {
    const viewport = { position: { x: 0, y: 0 }, scale: 2.0 }
    expect(reset(ID, viewport)).toEqual({ effects: [ expectedEffect(DEFAULT_VIEWPORT) ] })
  })
  it("Works with a frozen viewport", () => {
    const viewport = Object.freeze({ position: Object.freeze({ x: 10, y: 10 }), scale: 2.0 })
    expect(reset(ID, viewport)).toEqual({ effects: [ expectedEffect(DEFAULT_VIEWPORT) ] })
  })
})