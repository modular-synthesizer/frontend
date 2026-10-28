import { ko, ok } from "../../../../shared/results/result";
import { saveViewport } from "../saveViewport.http";
import { expect, it } from "vitest";
import { DEFAULT_VIEWPORT } from "../../../../viewports/core/shared/Constants";
import type { Uuid } from "../../../../shared/data/Uuid.type";
import { recorder } from "../../../../shared/http/__tests__/utils/recorder";

const ID = "uuid" as Uuid

it("only sends x, y coordinates, and scale", async () => {
  const { put, calls } = recorder(ok({}))
  await saveViewport(put)(ID, { position: { x: 3, y: 4 }, scale: 2 })
  expect(calls).toEqual([{ url: `/proxy/blueprints/${ID}`, body: { x: 3, y: 4, scale: 2 } }])
})

it("returns an error if the underlying request raises an error", async () => {
  const { put } = recorder(ko({ status: 500 }))
  expect((await saveViewport(put)(ID, DEFAULT_VIEWPORT)).ok).toBe(false)
})