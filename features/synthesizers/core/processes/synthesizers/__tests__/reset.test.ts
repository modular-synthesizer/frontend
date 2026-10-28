import { describe, expect, it } from "vitest";
import { reset } from "../reset.process";
import { DEFAULT_VIEWPORT } from "../../../../../viewports/core/shared/Constants";
import type { Uuid } from "../../../../../shared/data/Uuid.type";
import type { Viewport } from "../../../../../viewports/core/data/Viewport.type";

const ID = "00000000-0000-0000-000000000000" as Uuid

function expectedEffect(viewport: Viewport) {
  return { type: "synthesizers.viewport.save", id: ID, viewport }
}

describe("reset", () => {
  it("Resets the viewport if the synthesizer is not already reset", () => {
    const viewport = { position: { x: 10, y: 10 }, scale: 1.0 }
    expect(reset(ID, viewport)).toEqual({
      viewport: DEFAULT_VIEWPORT,
      effects: [ expectedEffect(DEFAULT_VIEWPORT) ]
    })
  })
  it("Does not reset the viewport if it's already at the origin", () => {
    expect(reset(ID, DEFAULT_VIEWPORT)).toEqual({ viewport: DEFAULT_VIEWPORT, effects: [] })
  })
})