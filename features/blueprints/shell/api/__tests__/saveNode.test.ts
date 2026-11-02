import { ko, ok } from "../../../../shared/results/result";
import { describe, expect, it } from "vitest";
import type { Uuid } from "../../../../shared/data/Uuid.type";
import { recorder } from "../../../../shared/http/__tests__/utils/recorder";
import { saveNode } from "../saveNode.http";

const BLUEPRINT_ID = "blueprintId" as Uuid
const ID = "uuid" as Uuid

describe("saveNode", () => {
  it("sends the blueprint id, the node id, and the node position", async () => {
    const { put, calls } = recorder(ok({}))
    await saveNode(put)(BLUEPRINT_ID, ID, { x: 3, y: 4 })
    expect(calls).toEqual([{ url: `/proxy/blueprints/nodes/${ID}`, body: { blueprint_id: BLUEPRINT_ID, x: 3, y: 4 } }])
  })

  it("returns an error if the underlying request raises an error", async () => {
    const { put } = recorder(ko({ status: 500 }))
    expect((await saveNode(put)(BLUEPRINT_ID, ID, { x: 0, y: 0 })).ok).toBe(false)
  })
})