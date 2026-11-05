import { describe, expect, it } from "vitest";
import type { Session } from "../../../core/data/Session.type";
import { toObjectId } from "../../../../shared/data/ObjectId.type";
import { makeLogin, toLegacySession } from "../login.adapter";
import { type CreateSessionFct } from "../../api/createSession.http";
import type { Credentials } from "../../../core/data/Credentials.type";
import { ko, ok, type Result } from "../../../../shared/results/result";
import type { SessionsEffect } from "../../../core/data/Effect.type";
import type { HttpError } from "../../../../shared/http/http";

const session: Session = {
  token: "custom.token", admin: true, rights: [ "first.right" ],
  account: { id: toObjectId("account.id"), username: "testuser", email: "test@mail.com" }
}

const createLogin = () => {
  const creations: Credentials[] = []
  const process: CreateSessionFct = async credentials => {
    creations.push(credentials)
    return ok(session)
  }
  const journal: string[] = []
  const run = async (effect: SessionsEffect) => {
    journal.push(`start:${effect.type}`)
    await new Promise(resolve => setTimeout(resolve, 0))
    journal.push(`end:${effect.type}`)
  }

  return { creations, run, journal, process }
}

describe("makeLoginAdapter", () => {
  it("Returns an error for an invalid form input", async () => {
    const { run, journal, process, creations } = createLogin()
    const login = makeLogin(process, run)
    const credentials = { username: "", password: "password" }
    const errors = await login(credentials)

    expect(errors).toEqual([ { field: "username", reason: "required" } ])
    expect(journal).toEqual([])
    expect(creations).toEqual([])
  })
  it("calls the creation, then triggers both effects in the correct order if everything is fine", async () => {
    const { journal, process, run, creations } = createLogin()
    const login = makeLogin(process, run)
    const credentials = { username: "username", password: "password" }
    const errors = await login(credentials)

    expect(errors).toEqual([])
    expect(creations).toEqual([ credentials ])
    expect(creations[0]).not.toBe(credentials)
    expect(journal).toEqual([
      "start:sessions.session.store",
      "end:sessions.session.store",
      "start:sessions.navigate",
      "end:sessions.navigate",
    ])
  })
  it("returns the correct error if the underlying request fails", async () => {
    const error: Result<Session, HttpError> = ko({ status: 403, key: "username", message: "forbidden" })
    const { run, journal } = createLogin()
    const createProcess: CreateSessionFct = async () => error 
    const login = makeLogin(createProcess, run)
    const credentials = { username: "username", password: "password" }
    const errors = await login(credentials)

    expect(errors).toEqual([ { field: "username", reason: "forbidden" } ])
    expect(journal).toEqual([])
  })
  it("lets the rejection of the session creation go through", async () => {
    const { run, journal } = createLogin()
    const failure = new Error("network down")
    const rejecting: CreateSessionFct = async () => { throw failure }
    const login = makeLogin(rejecting, run)

    await expect(login({ username: "username", password: "password" })).rejects.toBe(failure)
    expect(journal).toEqual([])
  })
})

describe("toLegacySession", () => {
  const account = { username: "test_username", email: "test@mail.com", id: toObjectId("test") }
  const session: Session = { admin: true, rights: [], token: "test.token", account }

  it("correctly translates a session into the legacy type", () => {
    expect(toLegacySession(session)).toEqual({
      id: "",
      token: "test.token",
      rights: [],
      admin: true,
      account: { id: "test", username: "test_username", email: "test@mail.com" }
    })
  })
  it("translates a non admin session into the legacy type", () => {
    const acc = {  username: "test_nonadmin", email: "nonadmin@mail.com", id: toObjectId("other") }
    const nonAdmin = { ...session, token: "other.token", admin: false, account: acc }

    expect(toLegacySession(nonAdmin)).toEqual({
      id: "",
      token: "other.token",
      rights: [],
      admin: false,
      account: { id: "other", username: "test_nonadmin", email: "nonadmin@mail.com" }
    })
  })
  it("translates the rights as legacy rights", () => {
    const acc = { ...account, username: "test_rights", email: "rights@mail.com" }
    const withRights: Session = { ...session, rights: [ "test.right", "other.right" ], account: acc }

    expect(toLegacySession(withRights)).toEqual({
      id: "",
      token: "test.token",
      rights: [ { id: "", label: "test.right" }, { id: "", label: "other.right" }],
      admin: true,
      account: { id: "test", username: "test_rights", email: "rights@mail.com" }
    })
  })
})