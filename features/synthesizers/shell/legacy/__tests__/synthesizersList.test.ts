import { describe, expect, it } from "vitest"
import { recorder } from "../../../../shared/http/__tests__/utils/recorder"
import { ko, ok, type Result } from "../../../../shared/results/result"
import { makeDeleteSynthesizer } from "../../api/deleteSynthesizer.http"
import { makeDeleteFromList } from "../synthesizersList.adapter"
import type { HttpError, HttpRequest } from "../../../../shared/http/http"

describe("deleteFromList", () => {

  const first = { id: "id.a" }
  const second = { id: "id.b" }
  const third = { id: "id.c" }

  it("removes the element from the list, and calls for a deletion once", async () => {
    const { calls, requester } = recorder(ok({}))
    const deleteSynthesizer = makeDeleteSynthesizer(requester)
    const deleteFromList = makeDeleteFromList(deleteSynthesizer)
    const list = [ first, second, third ]
    const payload = { value: list }
    await deleteFromList(payload, "id.b")
    expect(calls).toEqual([ { url: "/proxy/synthesizers/id.b", body: {} } ])
    expect(payload).toEqual({ value: [ first, third ] })
  })
  it("does not remove any element from the list if the query is a failure", async () => {
    const { calls, requester } = recorder(ko({ status: 500 }))
    const deleteSynthesizer = makeDeleteSynthesizer(requester)
    const deleteFromList = makeDeleteFromList(deleteSynthesizer)
    const list = [ first, second, third ]
    const payload = { value: list }
    await deleteFromList(payload, "id.b")
    expect(calls).toEqual([ { url: "/proxy/synthesizers/id.b", body: {} } ])
    expect(payload).toEqual({ value: [ first, second, third ] })
  })
  it("executes two simultaneous deletions, even if evaluated in the inverse order", async () => {
    const calls: string[] = []
    const pending: Record<string, (r: Result<unknown, HttpError>) => void> = {}
    const requester: HttpRequest = (url) => {
      calls.push(url)
      return new Promise(resolve => { pending[url] = resolve })
    }
    const deleteFromList = makeDeleteFromList(makeDeleteSynthesizer(requester))
    const payload = { value: [ first, second, third ] }

    const deletingB = deleteFromList(payload, "id.b")
    const deletingA = deleteFromList(payload, "id.a")

    pending["/proxy/synthesizers/id.a"]?.(ok(undefined))
    await deletingA
    pending["/proxy/synthesizers/id.b"]?.(ok(undefined))
    await deletingB

    expect(calls).toEqual([ "/proxy/synthesizers/id.b", "/proxy/synthesizers/id.a" ])
    expect(payload.value).toEqual([ third ])
  })
  it("keeps synthesizers added during a deletion in the list", async () => {
    const { calls, requester } = recorder(ok({}))
    const deleteSynthesizer = makeDeleteSynthesizer(requester)
    const deleteFromList = makeDeleteFromList(deleteSynthesizer)
    const list = [ first, second, third ]
    const payload = { value: list }
    const promise = deleteFromList(payload, "id.b")
    const fourth = { id: "id.d" }
    list.push(fourth)
    await promise
    expect(calls).toEqual([ { url: "/proxy/synthesizers/id.b", body: {} } ])
    expect(payload).toEqual({ value: [ first, third, fourth ] })
  })
  it("forwards exceptions encountered during the process", async () => {
    const deleteSynthesizer = makeDeleteSynthesizer(async () =>  { throw new Error("network down") })
    const deleteFromList = makeDeleteFromList(deleteSynthesizer)
    const list = [ first, second, third ]
    const payload = { value: list }
    await expect(deleteFromList(payload, "id.b")).rejects.toThrow("network down")
    expect(payload).toEqual({ value: [ first, second, third ] })
  })
})
