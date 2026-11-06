import axios, { AxiosError, type AxiosRequestConfig, type AxiosRequestHeaders, type AxiosResponse } from "axios";
import { describe, expect, it } from "vitest";
import { createRequester, toHttpError, type RequesterFactory } from "../axios.http";
import type { HttpMethod } from "../http";

describe("toHttpError", () => {
  const nullResponse = null as unknown as AxiosResponse
  const headers = null as unknown as AxiosRequestHeaders

  it("correctly returns the default error for an unknown error not due to axios", () => {
    expect(toHttpError("test")).toEqual({ status: 500, key: "unknown", message: "unknown" })
  })
  it("handles an error from an axios request", () => {
    const response: AxiosResponse = {
      data: { key: "username", message: "forbidden" }, status: 403, statusText: "Forbiden", headers, config: { headers }
    }
    const error: AxiosError = new AxiosError("", "403", { headers }, {}, response)
    expect(toHttpError(error)).toEqual({ status: 403, key: "username", message: "forbidden" })
  })
  it("handles an error without a response body to read from", () => {
    const error: AxiosError = new AxiosError("", "403", { headers }, {}, nullResponse)
    expect(toHttpError(error)).toEqual({ status: 500, key: "unknown", message: "unknown" })
  })
  it("handles an error with no data inside the body", () => {
    const response: AxiosResponse = {
      data: null, status: 403, statusText: "Forbiden", headers, config: { headers }
    }
    const error: AxiosError = new AxiosError("", "403", { headers }, {}, response)
    expect(toHttpError(error)).toEqual({ status: 403, key: undefined, message: undefined })
  })
})

const createRecordRequester = () => {
  const calls: AxiosRequestConfig[] = []
  const requester = (async (config: AxiosRequestConfig) => (calls.push(config))) as unknown as typeof axios.request
  return { calls, requester }
}

describe("createGet", () => {
  it("gives the auth_token in the parameters as expected", async () => {
    const { calls, requester } = createRecordRequester()
    const get = createRequester("get", requester)

    await get(() => ({ auth_token: "test.token", tab_id: "test.tab" }))("/url", { foo: "bar" })

    expect(calls).toEqual([
      { method: "get", url: "/url", data: { }, params: { foo: "bar", auth_token: "test.token", tab_id: "test.tab" } }
    ])
  })
})

describe("createDelete", () => {
  it("gives the auth_token in the parameters as expected", async () => {
    const { calls, requester } = createRecordRequester()
    const get = createRequester("delete", requester)

    await get(() => ({ auth_token: "test.token.del", tab_id: "test.tab.del" }))("/del", { foo: "baz" })

    expect(calls).toEqual([
      { method: "delete", url: "/del", data: { }, params: { foo: "baz", auth_token: "test.token.del", tab_id: "test.tab.del" } }
    ])
  })
})

describe("createPut", () => {
  it("gives the auth_token in the body as expected", async () => {
    const { calls, requester } = createRecordRequester()
    const get = createRequester("put", requester)

    await get(() => ({ auth_token: "test.token.del", tab_id: "test.tab.del" }))("/del", { foo: "baz" })

    expect(calls).toEqual([
      { method: "put", url: "/del", data: { foo: "baz", auth_token: "test.token.del", tab_id: "test.tab.del" }, params: { } }
    ])
  })
})

describe("createPost", () => {
  it("gives the auth_token in the body as expected", async () => {
    const { calls, requester } = createRecordRequester()
    const get = createRequester("post", requester)

    await get(() => ({ auth_token: "test.token.del", tab_id: "test.tab.del" }))("/del", { foo: "baz" })

    expect(calls).toEqual([
      { method: "post", url: "/del", data: { foo: "baz", auth_token: "test.token.del", tab_id: "test.tab.del" }, params: { } }
    ])
  })
})

const createRejectingRequester = (error: unknown) =>
  (async () => { throw error }) as unknown as typeof axios.request

describe("a rejected request", () => {
  const headers = null as unknown as AxiosRequestHeaders
  const tokens = () => ({ auth_token: "test.token", tab_id: "test.tab" })

  it("resolves with a failure carrying the HTTP error from the API response", async () => {
    const response: AxiosResponse = {
      data: { key: "auth_token", message: "unknown" }, status: 403, statusText: "Forbidden", headers, config: { headers }
    }
    const error = new AxiosError("", "403", { headers }, {}, response)
    const get = createRequester("get", createRejectingRequester(error))(tokens)

    const result = await get("/url", {})

    expect(result.ok).toBe(false)
    expect(result.error()).toEqual({ status: 403, key: "auth_token", message: "unknown" })
  })

  it("resolves with the unknown error when the request fails without a response", async () => {
    const put = createRequester("put", createRejectingRequester(new Error("Network Error")))(tokens)

    await expect(put("/url", {})).resolves.toSatisfy(r => !r.ok)
    expect((await put("/url", {})).error()).toEqual({ status: 500, key: "unknown", message: "unknown" })
  })
})