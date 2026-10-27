import { ko, ok } from "../../../../shared/results/result";
import { saveViewport } from "../saveViewport.http";
import { expect, it } from "vitest";
import { DEFAULT_VIEWPORT } from "../../../core/shared/Constants";
import type { Uuid } from "../../../core/data/Uuid.type";
import { recorder } from "./utils/recorder";

const ID = "uuid" as Uuid

it("only sends x, y coordinates, and scale", async () => {
  const { put, calls } = recorder(ok({}))
  await saveViewport(put)(ID, { position: { x: 3, y: 4 }, scale: 2 })
  expect(calls).toEqual([{ url: `/proxy/synthesizers/${ID}`, body: { x: 3, y: 4, scale: 2 } }])
})

it("returns an error if the underlying request raises an error", async () => {
  const { put } = recorder(ko({ status: 500 }))
  expect((await saveViewport(put)(ID, DEFAULT_VIEWPORT)).ok).toBe(false)
})