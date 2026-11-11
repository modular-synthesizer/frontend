import { describe, expect, it } from "vitest"
import { cancelCable } from "../cancelCable.process"
import type { Port } from "../../data/Port.type"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import type { Connection } from "../../data/Cable.type"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import { IDLE_DRAG } from "../../shared/Constants"
import type { CableDrag } from "../../data/CableDrag.type"

const frozenIdle = deepFreeze(IDLE_DRAG)

describe("cancelCable", () => {
  const origin: Port = deepFreeze({
    id: toObjectId("origin"), index: 0, kind: "output", moduleId: toObjectId("id"), node: "test"
  })
  const target: Port = deepFreeze({
    id: toObjectId("destination"), index: 0, kind: "input", moduleId: toObjectId("id"), node: "test"
  })
  const connection: Connection = deepFreeze({ origin, destination: target })

  it("handles an already idle state without effect", () => {
    expect(cancelCable(frozenIdle)).toEqual({ drag: frozenIdle, effects: [] })
  })
  it("cancels a started drag without effect", () => {
    const initial: CableDrag = deepFreeze({ step: "started", origin })
    expect(cancelCable(initial)).toEqual({
      drag: frozenIdle, effects: []
    })
  })
  it("cancels a magnetized drag and emits the corresponding effect", () => {
    const initial: CableDrag = deepFreeze({ step: "magnetized", origin, target, connection })
    expect(cancelCable(initial)).toEqual({
      drag: frozenIdle,
      effects: [ { type: "cables.audio.disconnect", connection } ]
    })
  })
})