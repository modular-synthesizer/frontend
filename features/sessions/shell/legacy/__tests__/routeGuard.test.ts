import { describe, expect, it } from "vitest"
import { makeRouteGuard } from "../routeGuard.adapter"

describe("routeGuard", () => {
  it("redirects the user to the home page if the token is not empty", () => {
    expect(makeRouteGuard(() => "test.token")("login")).toEqual("/")
  })
  it.each([
    [ "undefined", undefined ],
    [ "a symbol", Symbol("route") ],
    [ "an array that stringifies to an anonymous route", [ "login" ] ],
  ])("redirects an anonymous user to the home page when the route name is %s", (_label, name) => {
    expect(makeRouteGuard(() => "")(name)).toEqual("/")
  })
  it("reads the token only when called", () => {
    let token = ""
    const routeGuard = makeRouteGuard(() => token)
    token = "test.token"
    expect(routeGuard("synthesizers")).toEqual(null)
  })
})
