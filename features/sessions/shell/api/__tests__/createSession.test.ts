import { describe, expect, it } from "vitest";
import { httpRecorder } from "../../../../shared/http/__tests__/utils/recorder";
import { ko, ok } from "../../../../shared/results/result";
import { makeCreateSession } from "../createSession.http";
import type { HttpError } from "~/features/shared/http/http";

describe("makeCreateSession", () => {
  const account = { id: "accid", username: "testuser", email: "test@mail.com" }
  const payload = { token: "custom.token", admin: true, rights: [], account }

  async function withResponse(payload: unknown) {
    const { requester, calls } = httpRecorder(ok(payload))
    const createSession = makeCreateSession(requester)
    const response = await createSession({ username: "testusername", password: "testpassword" })
    return { response, calls }
  }

  describe("nominal cases", () => {
    it("returns the session if it can be parsed correctly from a response", async () => {
      const { response, calls } = await withResponse(payload)

      expect(response.orNull()).toEqual(payload)
      expect(calls).toEqual([ { url: "/proxy/sessions", body: { username: "testusername", password: "testpassword" } } ])
    })
    it("correctly returns the session with an invalid admin status", async () => {
      const withInvalidAdmin = { ...payload, admin: "invalid" }
      const { response, calls } = await withResponse(withInvalidAdmin)

      expect(response.orNull()).toEqual({ ...withInvalidAdmin, admin: false })
      expect(calls).toEqual([ { url: "/proxy/sessions", body: { username: "testusername", password: "testpassword" } } ])
    })
    it("filters the invalid rights from the array", async () => {
      const rights = [ { label: "first" }, { label: "second" }, "test", { label: 42 }, undefined ]
      const withInvalidRights = { ...payload, rights }
      const { response, calls } = await withResponse(withInvalidRights)

      expect(response.orNull()).toStrictEqual({ ...payload, rights: [ "first", "second" ] })
      expect(calls).toEqual([ { url: "/proxy/sessions", body: { username: "testusername", password: "testpassword" } } ])
    })
  })
  describe("error cases", () => {
    async function withError(payload: HttpError) {
      const { requester, calls } = httpRecorder(ko(payload))
      const createSession = makeCreateSession(requester)
      const response = await createSession({ username: "testusername", password: "testpassword" })
      return { response, calls }
    }
    it("returns the correct error if the underlying response is an error", async () => {
      const { response, calls } = await withError({ status: 404, key: "username", message: "unknown" })

      expect(response.error()).toEqual({ status: 404, key: "username", message: "unknown" })
      expect(calls).toEqual([ { url: "/proxy/sessions", body: { username: "testusername", password: "testpassword" } } ])
    })
    it("returns the correct error if the session cannot be parsed", async () => {
      const { response, calls } = await withResponse({ foo: "bar" })

      expect(response.error()).toEqual({ status: 500, key: "unknown", message: "unknown" })
      expect(calls).toEqual([ { url: "/proxy/sessions", body: { username: "testusername", password: "testpassword" } } ])
    })
    it("returns the correct error if the auth token is not returned by the API", async () => {
      const { response, calls } = await withResponse({ admin: false, rights: [], account })

      expect(response.error()).toEqual({ status: 500, key: "unknown", message: "unknown" })
      expect(calls).toEqual([ { url: "/proxy/sessions", body: { username: "testusername", password: "testpassword" } } ])
    })
    it("returns the correct error if the account is not returned by the API", async () => {
      const { response, calls } = await withResponse({ token: "test", admin: false, rights: [] })

      expect(response.error()).toEqual({ status: 500, key: "unknown", message: "unknown" })
      expect(calls).toEqual([ { url: "/proxy/sessions", body: { username: "testusername", password: "testpassword" } } ])
    })
    it("returns the correct error if the rights are not given as an array", async () => {
      const { response, calls } = await withResponse({ token: "test", admin: false, rights: "test", account })

      expect(response.error()).toEqual({ status: 500, key: "unknown", message: "unknown" })
      expect(calls).toEqual([ { url: "/proxy/sessions", body: { username: "testusername", password: "testpassword" } } ])
    })
    it("returns ok but has no body to parse", async () => {
      const { response, calls } = await withResponse(undefined)

      expect(response.error()).toEqual({ status: 500, key: "unknown", message: "unknown" })
      expect(calls).toEqual([ { url: "/proxy/sessions", body: { username: "testusername", password: "testpassword" } } ])
    })
    it("returns ok with an invalid type token", async () => {
      const { response, calls } = await withResponse({ ...payload, token: 42})

      expect(response.error()).toEqual({ status: 500, key: "unknown", message: "unknown" })
      expect(calls).toEqual([ { url: "/proxy/sessions", body: { username: "testusername", password: "testpassword" } } ])
    })
  })
})