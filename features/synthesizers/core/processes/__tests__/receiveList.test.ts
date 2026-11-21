import { describe, expect, it } from "vitest";
import { ko, ok } from "../../../../shared/results/result";
import { receiveList } from "../receiveList.process";
import type { HttpError } from "../../../../shared/http/http";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";

describe("receiveList", () => {
  const first = { id: "id.a" }
  const second = { id: "id.b" }

  it("integrates the elements of an OK response to an empty list", () => {
    const list = deepFreeze([ first, second ])
    const result = receiveList([], deepFreeze(ok(list)))
    expect(result).toEqual({ status: "loaded", items: list })
    expect(result.items).not.toBe(list)
    expect(result.items[0]).toBe(first)
    expect(result.items[1]).toBe(second)
  })
  it("integrates an element from an OK response to a list not already containing it", () => {
    const result = receiveList(deepFreeze([ first ]), deepFreeze(ok([ second ])))
    expect(result).toEqual({ status: "loaded", items: [ second, first ] })
  })
  it("overwrites an element of the current list with the response if ids are the same", () => {
    const list = deepFreeze([ { ...first, name: "test.name" } ])
    const incoming = { ...first, name: "other.name" }
    const response = deepFreeze(ok([ incoming ]))
    const result = receiveList(list, response)
    expect(result).toEqual({ status: "loaded", items: [ incoming ] })
    expect(result.items[0]).toBe(incoming)
  })
  it("returns an empty failed list if the response was a failure", () => {
    const response = deepFreeze(ko<{ id: string }[], HttpError>({ status: 500 }))
    expect(receiveList(deepFreeze([]), response)).toEqual({ status: "failed", items: [] })
  })
  it("returns existing elements if the response was a failure", () => {
    const list = deepFreeze([ first, second ])
    const response = deepFreeze(ko<{ id: string }[], HttpError>({ status: 500 }))
    const result = receiveList(list, response)
    expect(result).toEqual({ status: "failed", items: list })
    expect(result.items).not.toBe(list)
    expect(result.items[0]).toBe(first)
    expect(result.items[1]).toBe(second)
  })
})
