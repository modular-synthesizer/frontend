import { describe, expect, it } from "vitest"
import type { CableDrag } from "../../data/CableDrag.type"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import type { InputPort, OutputPort } from "../../data/Port.type"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import { IDLE_DRAG } from "../../shared/Constants"
import { unmagnetizeCable } from "../unmagnetizeCable.process"

const frozenIdle = deepFreeze(IDLE_DRAG)

const freeOutput: OutputPort = deepFreeze({
  id: toObjectId("origin"), moduleId: toObjectId("moduleId"), index: 0, kind: "output", node: "test"
})
const freeInput: InputPort = deepFreeze({
  id: toObjectId("destination"), moduleId: toObjectId("moduleId"), index: 1, kind: "input", node: "other"
})

describe("unmagnetizeCable", () => {
  it("can unmagnetize a previously magnetized cable, and disconnect its audio", () => {
    const conn = { origin: freeOutput, destination: freeInput }
    const initial: CableDrag = deepFreeze({ step: "magnetized", origin: freeOutput, target: freeInput, connection: conn })
    const leftPort = deepFreeze({ ...freeInput })

    expect(unmagnetizeCable(initial, leftPort)).toEqual({
      drag: { step: "started", origin: freeOutput },
      effects: [ { type: "cables.audio.disconnect", connection: conn } ]
    })
  })
  it("does nothing if the unmagnetized port is not the same as the target port", () => {
    const conn = { origin: freeOutput, destination: freeInput }
    const initial: CableDrag = deepFreeze({ step: "magnetized", origin: freeOutput, target: freeInput, connection: conn })

    expect(unmagnetizeCable(initial, freeOutput)).toEqual({
      drag: initial, effects: []
    })
  })
  it("does nothing on a started cable as it's not magnetized", () => {
    const initial: CableDrag = deepFreeze({ step: "started", origin: freeOutput })

    expect(unmagnetizeCable(initial, freeOutput)).toEqual({
      drag: initial, effects: []
    })
  })
  it("does nothing on an idle cable creation state", () => {
    expect(unmagnetizeCable(frozenIdle, freeOutput)).toEqual({
      drag: frozenIdle, effects: []
    })
  })
})