import { describe, expect, it } from "vitest";
import { reset } from "../reset.process";
import { DEFAULT_VIEWPORT } from "../../../../viewports/core/shared/Constants";
import { toObjectId } from "../../../../shared/data/ObjectId.type";
import type { Viewport } from "../../../../viewports/core/data/Viewport.type";

const ID = toObjectId("test")

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