import { describe, expect, it } from "vitest";
import { receiveRefresh } from "../receiveRefresh.process";
import { ko, ok } from "../../../../shared/results/result";
import { toObjectId } from "../../../../shared/data/ObjectId.type";
import type { HttpError } from "../../../../shared/http/http";
import type { Session } from "../../data/Session.type";
import type { SessionStoreEffect } from "../../data/Effect.type";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";

describe("receiveRefresh", () => {
  const account = { username: "username", email: "test@mail.com", id: toObjectId("id") }
  const session = deepFreeze({ token: "test.token", admin: true, rights: [], account })

  it("stores the session if the response is ok, and both tokens identical", () => {
    const result = receiveRefresh("test.token", "test.token", ok(session))
    expect(result).toEqual({ effects: [ { type: "sessions.session.store", session } ] })
    const effect = result.effects[0] as SessionStoreEffect
    expect(effect.session).toBe(session)
  })
  it("does not store the session if the current token is empty", () => {
    const result = receiveRefresh("test.token", "", ok(session))
    expect(result).toEqual({ effects: [] })
  })
  it("does not store the new session if response is ok and both tokens are different", () => {
    const result = receiveRefresh("stored", "test.token", ok(session))
    expect(result).toEqual({ effects: [] })
  })
  it("does nothing if the response is in 403 about the auth token", () => {
    const error = ko<Session, HttpError>({ status: 403, key: "auth_token", message: "forbidden" })
    const result = receiveRefresh("test.token", "test.token", error)
    expect(result).toEqual({ effects: [] })
  })
  it("does nothing for unknown errors", () => {
    const error = ko<Session, HttpError>({ status: 500, key: "unknown", message: "unknown" })
    const result = receiveRefresh("test.token", "test.token", error)
    expect(result).toEqual({ effects: [] })
  })
})
