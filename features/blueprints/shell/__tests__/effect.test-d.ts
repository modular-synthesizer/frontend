import { describe, expectTypeOf, it } from "vitest";
import { makeRunEffect } from "../effect";
import { put } from "../../../shared/http/nuxt.http";
import type { RunEffectFct } from "../../../shared/facts";
import type { BlueprintsEffect } from "../../core/data/Effect.type";
import { toObjectId } from "../../../shared/data/ObjectId.type";

describe("makeRunEffect", () => {
  const id = toObjectId("test")
  const position = { x: 0, y: 0 }

  it("builds the correct function type", () => {
    expectTypeOf(makeRunEffect(put)).toEqualTypeOf<RunEffectFct<BlueprintsEffect>>()
  })
  it("answer to the blueprint save effect", () => {
    const viewport = { position, scale: 1.0 }
    expectTypeOf(makeRunEffect(put)).toBeCallableWith({ type: "blueprints.viewport.save", id, viewport })
  })
  it("answers to the node save effect", () => {
    const expected: BlueprintsEffect = { type: "blueprints.node.save", id, blueprintId: id, position }
    expectTypeOf(makeRunEffect(put)).toBeCallableWith(expected)
  })
  it("fails with an unknown event", () => {
    // @ts-expect-error synthesizers.viewport.save
    expectTypeOf(makeRunEffect(put)).toBeCallableWith({ type: "synthesizers.viewport.save" })
  })
})