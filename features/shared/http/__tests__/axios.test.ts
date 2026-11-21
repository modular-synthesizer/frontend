import axios, { AxiosError, type AxiosRequestHeaders, type AxiosResponse } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createGet, toHttpError } from "../axios.http";
import { ko, ok } from "../../results/result";

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

describe("createGet", () => {
  const headers = null as unknown as AxiosRequestHeaders
  const tokens = () => ({ auth_token: "token.auth", tab_id: "token.tab" })

  afterEach(() => { vi.restoreAllMocks() })

  it("sends a GET request with the parameters and the tokens in the query string", async () => {
    const request = vi.spyOn(axios, "request").mockResolvedValue({ data: [] } as AxiosResponse)
    await createGet(tokens)("/synthesizers", { type: "creator" })
    expect(request).toHaveBeenCalledOnce()
    expect(request).toHaveBeenCalledWith({
      method: "get",
      url: "/synthesizers",
      params: { type: "creator", auth_token: "token.auth", tab_id: "token.tab" }
    })
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty("data")
  })
  it("returns the data of a successful response", async () => {
    const data = [ { id: "id.a" } ]
    vi.spyOn(axios, "request").mockResolvedValue({ data } as AxiosResponse)
    expect(await createGet(tokens)("/synthesizers", {})).toEqual(ok(data))
  })
  it("returns the converted error of a failed request", async () => {
    const response: AxiosResponse = {
      data: { key: "auth_token", message: "expired" }, status: 401, statusText: "Unauthorized", headers, config: { headers }
    }
    const error = new AxiosError("", "401", { headers }, {}, response)
    vi.spyOn(axios, "request").mockRejectedValue(error)
    const result = await createGet(tokens)("/synthesizers", {})
    expect(result).toEqual(ko(toHttpError(error)))
    expect(result).toEqual(ko({ status: 401, key: "auth_token", message: "expired" }))
  })
})