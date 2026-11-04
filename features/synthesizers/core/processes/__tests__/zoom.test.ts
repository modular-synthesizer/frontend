import { describe, expect, it } from "vitest";
import { toObjectId } from "../../../../shared/data/ObjectId.type";
import { zoom } from "../zoom.process";

const ID = toObjectId("test")

function expectedEffect(scale: number) {
  return { type: "synthesizers.scale.save", id: ID, scale }
}

const viewport = Object.freeze({ position: Object.freeze({ x: 10, y: 20 }), scale: 2.0 })

describe("zoom", () => {
  it("does not trigger a save of the scale if it has not changed", () => {
    expect(zoom(ID, viewport, 0)).toEqual({ viewport, effects: [] })
  })
  it("does not produce an effect if the deltaY is negative but the scale is at MAX", () => {
    expect(zoom(ID, viewport, -100)).toEqual({ viewport, effects: [] })
  })
  it("produces a save of the scale when it changes", () => {
    expect(zoom(ID, viewport, 100)).toEqual({
      viewport: { ...viewport, scale: 1.5 },
      effects: [ expectedEffect(1.5) ]
    })
  })
})