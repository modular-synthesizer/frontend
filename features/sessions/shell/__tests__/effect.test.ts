import { describe, expect, it } from "vitest"
import type { Session } from "../../core/data/Session.type"
import type { SessionsEffect } from "../../core/data/Effect.type"
import { makeRunEffect, type SessionPorts } from "../effect"
import { toObjectId } from "../../../shared/data/ObjectId.type"
import { ko, ok, type Result } from "../../../shared/results/result"
import type { HttpError } from "../../../shared/http/http"

type Call = [ port: keyof SessionPorts, argument?: unknown ]

const createPorts = (response: Result<void, HttpError> = ok(undefined)) => {
  const calls: Call[] = []
  const ports: SessionPorts = {
    store: session => { calls.push([ "store", session ]) },
    navigate: to => { calls.push([ "navigate", to ]) },
    clear: () => { calls.push([ "clear" ]) },
    deleteSession: async token => { calls.push([ "deleteSession", token ]); return response },
  }
  return { ports, calls }
}

const account = { id: toObjectId("test"), username: "testuser", email: "email@test.com" }
const session: Session = { token: "test.token", rights: [], admin: true, account }

describe("makeRunEffect", () => {
  it("runs the storage effect", async () => {
    const { ports, calls } = createPorts()
    await makeRunEffect(ports)({ type: "sessions.session.store", session })
    expect(calls).toEqual([ [ "store", session ] ])
  })
  it("runs the navigation effect", async () => {
    const { ports, calls } = createPorts()
    await makeRunEffect(ports)({ type: "sessions.navigate", to: "/synthesizers" })
    expect(calls).toEqual([ [ "navigate", "/synthesizers" ] ])
  })
  it("fails with an unknown effect", async () => {
    const { ports, calls } = createPorts()
    const effect = { type: "unknown.type" } as unknown as SessionsEffect
    await expect(makeRunEffect(ports)(effect)).rejects.toThrow(JSON.stringify("unknown.type"))
    expect(calls).toEqual([])
  })
  it("runs the deletion effect with its token", async () => {
    const { ports, calls } = createPorts()
    await makeRunEffect(ports)({ type: "sessions.session.delete", token: "test.token" })
    expect(calls).toEqual([ [ "deleteSession", "test.token" ] ])
  })
  it("ignores a failed deletion", async () => {
    const { ports, calls } = createPorts(ko({ status: 500, key: "unknown", message: "unknown" }))
    await expect(makeRunEffect(ports)({ type: "sessions.session.delete", token: "test.token" })).resolves.toBeUndefined()
    expect(calls).toEqual([ [ "deleteSession", "test.token" ] ])
  })
  it("runs the clear effect", async () => {
    const { ports, calls } = createPorts()
    await makeRunEffect(ports)({ type: "sessions.session.clear" })
    expect(calls).toEqual([ [ "clear" ] ])
  })
})