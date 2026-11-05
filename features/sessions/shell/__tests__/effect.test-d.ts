import { describe, expectTypeOf, it } from "vitest";
import { makeRunEffect } from "../effect";
import type { RunEffectFct } from "../../../shared/facts";
import type { SessionsEffect } from "../../core/data/Effect.type";
import type { Session } from "../../core/data/Session.type";

describe("makeRunEffect", () => {
  it("builds the correct function type", () => {
    const runEffect = makeRunEffect({ store: () => {}, navigate: () => {} })
    expectTypeOf(runEffect).toEqualTypeOf<RunEffectFct<SessionsEffect>>()
  })
  it("answer to the navigation effect", () => {
    const runEffect = makeRunEffect({ store: () => {}, navigate: () => {} })
    expectTypeOf(runEffect).toBeCallableWith({ type: "sessions.navigate", to: "/" })
  })
  it("answers to the storage effect", () => {
    const runEffect = makeRunEffect({ store: () => {}, navigate: () => {} })
    expectTypeOf(runEffect).toBeCallableWith({ type: "sessions.session.store", session: null as unknown as Session })
  })
  it("fails with an unknown event", () => {
    const runEffect = makeRunEffect({ store: () => {}, navigate: () => {} })
    // @ts-expect-error unknown.type
    expectTypeOf(runEffect).toBeCallableWith({ type: "unknown.type" })
  })
})