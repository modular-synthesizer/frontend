import { ko, ok } from "../../../../shared/results/result";
import { describe, expect, it } from "vitest";
import { toObjectId } from "../../../../shared/data/ObjectId.type";
import { recorder } from "../../../../shared/http/__tests__/utils/recorder";
import { saveParameter } from "../saveParameter.http";

const id = toObjectId("id")
const moduleId = toObjectId("mid")

describe("saveParameter", () => {
  it("sends the id, moduleId, value and timestamp with the request", async () => {
    const { put, calls } = recorder(ok({}))
    await saveParameter(put)(id, moduleId, 20, 1234)
    expect(calls).toEqual([ { url: "/proxy/parameters/id", body: { module_id: "mid", value: 20, t: 1234 } } ])
  })

  it("returns an error if the underlying request raises an error", async () => {
    const { put } = recorder(ko({ status: 500 }))
    expect((await saveParameter(put)(id, moduleId, 20, 1234)).ok).toBe(false)
  })
})
