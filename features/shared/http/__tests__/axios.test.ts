import { AxiosError, type AxiosRequestHeaders, type AxiosResponse } from "axios";
import { describe, expect, it } from "vitest";
import { toHttpError } from "../axios.http";

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
