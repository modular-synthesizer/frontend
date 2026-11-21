import { describe, expect, it } from "vitest"
import { recorder } from "../../../../shared/http/__tests__/utils/recorder"
import { ko, ok, type Result } from "../../../../shared/results/result"
import { makeDeleteSynthesizer } from "../../api/deleteSynthesizer.http"
import { makeDeleteFromList, makeLoadList } from "../synthesizersList.adapter"
import type { HttpError, HttpRequest } from "../../../../shared/http/http"
import type { ApiSynthesizer } from "../../dto/ApiSynthesizer.dto"
import type { ListSynthesizersFct } from "../../api/listSynthesizers.http"
import type { ListStatus } from "../../../core/data/ListStatus.type"

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

describe("loadList", () => {

  const synth = (id: string): ApiSynthesizer => ({ id, name: id, members: [] })
  const first = synth("id.a")
  const second = synth("id.b")
  const third = synth("id.c")

  function pendingFetch() {
    let calls = 0
    let respond: (r: Result<ApiSynthesizer[], HttpError>) => void = () => {}
    const fetch: ListSynthesizersFct = () => {
      calls++
      return new Promise(resolve => { respond = resolve })
    }
    return { fetch, respond: (r: Result<ApiSynthesizer[], HttpError>) => respond(r), calls: () => calls }
  }

  it("sets the status to loading until the response arrives, whatever it was before", async () => {
    const { fetch, respond } = pendingFetch()
    const list = { value: [] as ApiSynthesizer[] }
    const status = { value: "failed" as ListStatus }
    const loading = makeLoadList(fetch)(list, status)
    expect(status.value).toBe("loading")
    respond(ok([]))
    await loading
  })

  it("fills the list and sets the status to loaded on success, fetching once", async () => {
    const { fetch, respond, calls } = pendingFetch()
    const list = { value: [] as ApiSynthesizer[] }
    const status = { value: "loading" as ListStatus }
    const loading = makeLoadList(fetch)(list, status)
    respond(ok([ first, second ]))
    await loading
    expect(list.value).toEqual([ first, second ])
    expect(status.value).toBe("loaded")
    expect(calls()).toBe(1)
  })

  it("keeps the initial list and sets the status to failed on an HTTP error", async () => {
    const { fetch, respond } = pendingFetch()
    const list = { value: [ first, second ] }
    const status = { value: "loading" as ListStatus }
    const loading = makeLoadList(fetch)(list, status)
    respond(ko({ status: 500, key: "unknown", message: "unknown" }))
    await loading
    expect(list.value).toEqual([ first, second ])
    expect(status.value).toBe("failed")
  })

  it("keeps a synthesizer added to the list during the request", async () => {
    const { fetch, respond } = pendingFetch()
    const list = { value: [ first ] }
    const status = { value: "loading" as ListStatus }
    const loading = makeLoadList(fetch)(list, status)
    list.value = [ ...list.value, third ]
    respond(ok([ first, second ]))
    await loading
    expect(list.value).toEqual([ first, second, third ])
    expect(status.value).toBe("loaded")
  })

  it("forwards a rejection of the fetch and leaves the list untouched", async () => {
    const fetch: ListSynthesizersFct = async () => { throw new Error("network down") }
    const initial = [ first, second ]
    const list = { value: initial }
    const status = { value: "loaded" as ListStatus }
    await expect(makeLoadList(fetch)(list, status)).rejects.toThrow("network down")
    expect(list.value).toBe(initial)
    expect(status.value).toBe("loading")
  })
})