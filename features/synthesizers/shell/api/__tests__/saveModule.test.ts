import { ko, ok } from "../../../../shared/results/result";
import { describe, expect, it } from "vitest";
import type { ObjectId } from "../../../../shared/data/ObjectId.type";
import { recorder } from "../../../../shared/http/__tests__/utils/recorder";
import { saveModule } from "../saveModule.http";

const ID = "testId" as ObjectId

describe("saveModule", () => {
  it("only sends ID and the position of the module", async () => {
    const { put, calls } = recorder(ok({}))
    await saveModule(put)(ID, { rack: 10, slot: 20 })
    expect(calls).toEqual([ { url: `/proxy/modules/${ID}`, body: { rack: 10, slot: 20 } } ])
  })

  it("returns an error if the underlying request raises an error", async () => {
    const { put } = recorder(ko({ status: 500 }))
    expect((await saveModule(put)(ID, { rack: 10, slot: 20 })).ok).toBe(false)
  })
})
