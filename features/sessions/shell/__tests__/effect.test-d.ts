import { describe, expectTypeOf, it } from "vitest";
import { makeRunEffect } from "../effect";
import type { RunEffectFct } from "../../../shared/facts";
import type { SessionsEffect } from "../../core/data/Effect.type";
import type { Session } from "../../core/data/Session.type";
import { ok } from "../../../shared/results/result";

describe("makeRunEffect", () => {
  const ports = { store: () => {}, navigate: () => {}, clear: () => {}, deleteSession: async () => ok(undefined) }
  const runEffect = makeRunEffect(ports)

  it("builds the correct function type", () => {
    expectTypeOf(runEffect).toEqualTypeOf<RunEffectFct<SessionsEffect>>()
  })
  it("answer to the navigation effect", () => {
    expectTypeOf(runEffect).toBeCallableWith({ type: "sessions.navigate", to: "/" })
  })
  it("answers to the storage effect", () => {
    expectTypeOf(runEffect).toBeCallableWith({ type: "sessions.session.store", session: null as unknown as Session })
  })
  it("answers to the clearance effect", () => {
    expectTypeOf(runEffect).toBeCallableWith({ type: "sessions.session.clear" })
  })
  it("answers to the deletion effect", () => {
    expectTypeOf(runEffect).toBeCallableWith({ type: "sessions.session.delete", token: "test.token" })
  })
  it("fails with an unknown event", () => {
    // @ts-expect-error unknown.type
    expectTypeOf(runEffect).toBeCallableWith({ type: "unknown.type" })
  })
})