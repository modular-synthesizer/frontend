import { describe, expect, it } from "vitest";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";
import { IDLE_DRAG } from "../../shared/Constants";
import { magnetizeCable } from "../magnetizeCable.process";
import type { InputPort, OutputPort } from "../../data/Port.type";
import { toObjectId } from "../../../../shared/data/ObjectId.type";
import type { Cable, Connection } from "../../data/Cable.type";
import type { CableDrag } from "../../data/CableDrag.type";

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

const freeOutput = deepFreeze({ ...cable.origin, id: toObjectId("id2") })
const freeInput = deepFreeze({ ...cable.destination, id: toObjectId("id3") })

describe("magnetizeCable", () => {
  it("magnetizes a cable started from a free output port correctly, connecting the audio in the process", () => {
    const initial: CableDrag = deepFreeze({ step: "started", origin: freeOutput })
    const conn: Connection = { origin: freeOutput, destination: freeInput }
    
    expect(magnetizeCable(initial, freeInput, cables)).toEqual({
      drag: { step: "magnetized", origin: freeOutput, target: freeInput, connection: conn },
      effects: [ { type: "cables.audio.connect", connection: conn } ]
    })
  })
  it("magnetizes a cable started from a free input port correctly, connecting the audio in the process", () => {
    const initial: CableDrag = deepFreeze({ step: "started", origin: freeInput })
    const conn: Connection = { origin: freeOutput, destination: freeInput }
    
    expect(magnetizeCable(initial, freeOutput, cables)).toEqual({
      drag: { step: "magnetized", origin: freeInput, target: freeOutput, connection: conn },
      effects: [ { type: "cables.audio.connect", connection: conn } ]
    })
  })
  it("does not magnetize two ports with the same kind", () => {
    const otherOutput = deepFreeze({ ...cable.origin, id: toObjectId("other2") })
    const initial: CableDrag = deepFreeze({ step: "started", origin: freeOutput })

    expect(magnetizeCable(initial, otherOutput, cables)).toEqual({
      drag: initial, effects: []
    })
  })
  it("does not magnetize a port with itself", () => {
    const initial: CableDrag = deepFreeze({ step: "started", origin: freeOutput })

    expect(magnetizeCable(initial, freeOutput, cables)).toEqual({
      drag: initial, effects: []
    })
  })
  it("does not magnetize a cable to an occupied input port", () => {
    const initial: CableDrag = deepFreeze({ step: "started", origin: freeOutput })

    expect(magnetizeCable(initial, destination, cables)).toEqual({
      drag: initial, effects: []
    })
  })
  it("does not magnetize a cable to an occupied output port", () => {
    const initial: CableDrag = deepFreeze({ step: "started", origin: freeInput })

    expect(magnetizeCable(initial, origin, cables)).toEqual({
      drag: initial, effects: []
    })
  })
  it("does not magnetize a cable whose origin output has been occupied since the start (received cable)", () => {
    // The fact that the cable was created before the test is not relevant, the test is just "start from an occupied port"
    const initial: CableDrag = deepFreeze({ step: "started", origin })

    expect(magnetizeCable(initial, freeInput, cables)).toEqual({
      drag: initial, effects: []
    })
  })
  it("does not magnetize a cable whose origin input has been occupied since the start (received cable)", () => {
    // The fact that the cable was created before the test is not relevant, the test is just "start from an occupied port"
    const initial: CableDrag = deepFreeze({ step: "started", origin: destination })

    expect(magnetizeCable(initial, freeOutput, cables)).toEqual({
      drag: initial, effects: []
    })
  })
  it("does not change the drag state if it's already magnetized, with no new audio connection", () => {
    const conn: Connection = { origin: freeOutput, destination: freeInput }
    const initial: CableDrag = deepFreeze({ step: "magnetized", origin: freeOutput, target: freeInput, connection: conn })

    expect(magnetizeCable(initial, freeInput, cables)).toEqual({
      drag: initial, effects: []
    })
  })
  it("does not change the drag state if it was idle (thus not started)", () => {
    expect(magnetizeCable(frozenIdle, freeInput, cables)).toEqual({ drag: frozenIdle, effects: [] })
  })
})