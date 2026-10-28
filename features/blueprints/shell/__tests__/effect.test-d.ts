import { describe, expectTypeOf, it } from "vitest";
import { makeRunEffect } from "../effect";
import { put } from "../../../shared/http/nuxt.http";
import type { RunEffectFct } from "../../../shared/facts";
import type { BlueprintsEffect } from "../../core/data/Effect.type";
import type { Uuid } from "../../../shared/data/Uuid.type";

describe("makeRunEffect", () => {
  it("builds the correct function type", () => {
    expectTypeOf(makeRunEffect(put)).toEqualTypeOf<RunEffectFct<BlueprintsEffect>>()
  })
  it("only accepts the events about blueprints", () => {
    const id = "test" as Uuid
    const viewport = { position: { x: 0, y: 0 }, scale: 1.0 }
    expectTypeOf(makeRunEffect(put)).toBeCallableWith({ type: "blueprints.viewport.save", id, viewport })
    // @ts-expect-error synthesizers.viewport.save
    expectTypeOf(makeRunEffect(put)).toBeCallableWith({ type: "synthesizers.viewport.save", id, viewport })
  })
})