import { describe, expect, it } from "vitest";
import { guardRoute } from "../guardRoute.process";

describe("guardRoute", () => {
  it("returns the home page if the user tries to reach the login while logged in", () => {
    expect(guardRoute("login", true)).toEqual("/")
  })
  it("does not redirect the user if they try to reach the login page while anonymous", () => {
    expect(guardRoute("login", false)).toEqual(null)
  })
  it("returns the home page if the user tries to reach the registration while logged in", () => {
    expect(guardRoute("register", true)).toEqual("/")
  })
  it("does not redirect the user if they try to reach the registration page while anonymous", () => {
    expect(guardRoute("register", false)).toEqual(null)
  })
  it("returns the home page if trying to reach it while logged in", () => {
    expect(guardRoute("index", true)).toEqual(null)
  })
  it("returns the home page if trying to reach it while not logged in", () => {
    expect(guardRoute("index", false)).toEqual(null)
  })
  it("returns the synthesizers page if trying to reach it while logged in", () => {
    expect(guardRoute("synthesizers", true)).toEqual(null)
  })
  it("returns the home page if trying to reach the synthesizers page while not logged in", () => {
    expect(guardRoute("synthesizers", false)).toEqual("/")
  })
})
