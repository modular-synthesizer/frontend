import { describe, expect, it } from "vitest"
import { receiveDeletion } from "../receiveDeletion.process"
import { ko, ok } from "../../../../shared/results/result"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"

describe("receiveDeletion", () => {
  const first = { id: "id.a" }
  const second = { id: "id.b" }
  const third = { id: "id.c" }
  it("deletes the received element, without modifying the rest of the list", () => {
    const list = deepFreeze([ first, second, third ])
    const result = receiveDeletion(list, "id.b", ok(undefined))
    expect(result).toEqual([ first, third ])
    expect(result[0]).toBe(first)
    expect(result[1]).toBe(third)
  })
  it("does not remove an item not found in the list", () => {
    const list = deepFreeze([ first, third ])
    const result = receiveDeletion(list, "id.b", ok(undefined))
    expect(result).toEqual([ first, third ])
    expect(result).not.toBe(list)
  })
  it("returns an empty list if the input list is empty", () => {
    const list = deepFreeze([])
    const result = receiveDeletion(list, "id.a", ok(undefined))
    expect(result).toEqual(list)
    expect(result).not.toBe(list)
  })
  it("returns the same list with another reference if the request is a failure", () => {
    const list = deepFreeze([ first ])
    const result = receiveDeletion(list, "id.a", ko({ status: 500 }))
    expect(result).toEqual([ first ])
    expect(result).not.toBe(list)
    expect(result[0]).toBe(first)
  })
})
