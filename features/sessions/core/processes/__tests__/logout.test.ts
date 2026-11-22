import { describe, expect, it } from "vitest"
import { logout } from "../logout.process"

describe("logout", () => {
  it("sends disconnect, clear and redirect events if the token is not empty", () => {
    expect(logout("test.token")).toEqual({
      effects: [
        { type: "sessions.session.delete", token: "test.token" },
        { type: "sessions.session.clear" },
        { type: "sessions.navigate", to: "/" },
      ]
    })
  })
  it("sends clear and redirect effects if the token is an empty string", () => {
    expect(logout("")).toEqual({
      effects: [
        { type: "sessions.session.clear" },
        { type: "sessions.navigate", to: "/" },
      ]
    })
  })
  it.each([
    [ "a token", "test.token" ],
    [ "an empty token", "" ]
  ])("generates fresh effects list with each call for %s", (_, token) => {
    const first = logout(token)
    const second = logout(token)
    
    expect(first.effects).toEqual(second.effects)
    expect(first.effects).not.toBe(second.effects)
  })
})
