import { describe, expect, it } from "vitest";
import { receiveRegistration } from "../receiveRegistration.process";
import { ko, ok } from "../../../../shared/results/result";

describe("receiveRegistration", () => {
  it("returns ok if the registration was successfully conducted", () => {
    expect(receiveRegistration(ok(undefined))).toEqual(ok(undefined))
  })
  it("correctly maps a form error from the API", () => {
    const result = receiveRegistration(ko({ status: 400, key: "email", message: "uniq" }))
    expect(result).toEqual(ko([ { field: "email", reason: "uniq" } ]))
  })
  it("correctly maps an unknown error", () => {
    const result = receiveRegistration(ko({ status: 500 }))
    expect(result).toEqual(ko([ { field: "form", reason: "unknown" } ]))
  })
})
