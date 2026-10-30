import { describe, expectTypeOf, it } from "vitest";
import { makeRunEffect } from "../effect";
import { put } from "../../../shared/http/nuxt.http";
import type { RunEffectFct } from "../../../shared/facts";
import type { SynthesizersEffect } from "../../core/data/Effect.type";
import type { Uuid } from "../../../shared/data/Uuid.type";

describe("makeRunEffect", () => {
  const id = "test" as Uuid
  const viewport = { position: { x: 0, y: 0 }, scale: 1.0 }

  it("builds the correct function type", () => {
    expectTypeOf(makeRunEffect(put)).toEqualTypeOf<RunEffectFct<SynthesizersEffect>>()
  })
  it("accepts the viewport save events", () => {
    expectTypeOf(makeRunEffect(put)).toBeCallableWith({
      type: "synthesizers.viewport.save", id, viewport
    })
  })
  it("accepts the scale save events", () => {
    expectTypeOf(makeRunEffect(put)).toBeCallableWith({
      type: "synthesizers.scale.save", id, scale: viewport.scale
    })
  })
  it("refuses blueprints viewport save events, even if it's a viewport event", () => {
    expectTypeOf(makeRunEffect(put)).toBeCallableWith({
      // @ts-expect-error blueprints.viewport.save
      type: "blueprints.viewport.save", id, viewport
    })
  })
})