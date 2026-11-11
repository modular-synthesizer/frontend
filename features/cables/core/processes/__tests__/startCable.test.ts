import { describe, expect, it } from "vitest"
import type { Cable, Connection } from "../../data/Cable.type"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import { startCable } from "../startCable.process"
import type { CableDrag } from "../../data/CableDrag.type"
import type { InputPort, OutputPort } from "../../data/Port.type"
import { IDLE_DRAG } from "../../shared/Constants"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"

const origin: OutputPort = deepFreeze({
  id: toObjectId("origin"), moduleId: toObjectId("moduleId"), index: 0, kind: "output", node: "test"
})

const destination: InputPort = deepFreeze({
  id: toObjectId("destination"), moduleId: toObjectId("moduleId"), index: 1, kind: "input", node: "other"
})

const connection: Connection = deepFreeze({ origin, destination })

const cable: Cable = deepFreeze({ id: toObjectId("cable"), color: "red", ...connection })

const cables: readonly Cable[] = deepFreeze([ cable ])

const frozenIdle = deepFreeze(IDLE_DRAG)

describe("startCable", () => {
  const freeOutput = deepFreeze({ ...cable.origin, id: toObjectId("id2") })
  const freeInput = deepFreeze({ ...cable.destination, id: toObjectId("id3") })

  it("triggers no effect if called from an idle drag step on a free output port", () => {
    expect(startCable(frozenIdle, freeOutput, cables)).toEqual({
      drag: { step: "started", origin: freeOutput }, effects: []
    })
  })
  it("triggers no effect if called from an idle drag step on a free input port", () => {
    expect(startCable(frozenIdle, freeInput, cables)).toEqual({
      drag: { step: "started", origin: freeInput }, effects: []
    })
  })
  it("stays idle if the starting port is an occupied input port", () => {
    expect(startCable(frozenIdle, destination, cables)).toEqual({ drag: frozenIdle, effects: [] })
  })
  it("stays idle if the starting port is an occupied output port", () => {
    expect(startCable(frozenIdle, origin, cables)).toEqual({ drag: frozenIdle, effects: [] })
  })
  it("can start another drag from an already started drag state", () => {
    const initial: CableDrag = deepFreeze({ step: "started", origin: freeInput })
    expect(startCable(initial, freeOutput, cables)).toEqual({
      drag: { step: "started", origin: freeOutput },
      effects: []
    })
  })
  it("can start another drag from a magnetized state, with a free port", () => {
    const initial: CableDrag = deepFreeze({ step: "magnetized", origin, target: destination, connection })
    expect(startCable(initial, freeOutput, cables)).toEqual({
      drag: { step: "started", origin: freeOutput },
      effects: [ { type: "cables.audio.disconnect", connection } ]
    })
  })
  it("can start another drag from a magnetized state, with an occupied port", () => {
    const initial: CableDrag = deepFreeze({ step: "magnetized", origin, target: destination, connection })
    expect(startCable(initial, destination, cables)).toEqual({
      drag: frozenIdle,
      effects: [ { type: "cables.audio.disconnect", connection } ]
    })
  })
})