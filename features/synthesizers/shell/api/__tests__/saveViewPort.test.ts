import { ko, ok, type Result } from "../../../../shared/results/result";
import type { HttpError, HttpPut } from "../http";
import { saveViewPort } from "../saveViewPort.http";
import { expect, it } from "vitest";
import { DEFAULT_VIEWPORT } from "../../../core/shared/Constants";

const ID = "uuid"

const recorder = (response: Result<unknown, HttpError>) => {
  const calls: { url: string, body: unknown }[] = []
  const put: HttpPut = async (url, body) => { calls.push({ url, body }); return response }
  return { put, calls }
}

it("n'envoie que x, y et scale", async () => {
  const { put, calls } = recorder(ok({}))
  await saveViewPort(put)(ID, { position: { x: 3, y: 4 }, scale: 2 })
  expect(calls).toEqual([{ url: `/proxy/synthesizers/${ID}`, body: { x: 3, y: 4, scale: 2 } }])
})

it("renvoie ko sur une 500", async () => {
  const { put } = recorder(ko({ status: 500 }))
  expect((await saveViewPort(put)(ID, DEFAULT_VIEWPORT)).ok).toBe(false)
})