import { ko, ok } from "../../../../shared/results/result";
import { expect, it } from "vitest";
import type { Uuid } from "../../../../shared/data/Uuid.type";
import { recorder } from "../../../../shared/http/__tests__/utils/recorder";
import { saveScale } from "../saveScale.http";

const ID = "uuid" as Uuid

it("only sends the scale", async () => {
  const { put, calls } = recorder(ok({}))
  await saveScale(put)(ID, 2.0)
  expect(calls).toEqual([{ url: `/proxy/synthesizers/${ID}`, body: { scale: 2.0 } }])
})

it("returns an error if the underlying request raises an error", async () => {
  const { put } = recorder(ko({ status: 500 }))
  expect((await saveScale(put)(ID, 2.0)).ok).toBe(false)
})