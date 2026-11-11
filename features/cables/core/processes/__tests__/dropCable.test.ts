import { describe, expect, it } from "vitest"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import type { InputPort, OutputPort } from "../../data/Port.type"
import type { Cable, Connection } from "../../data/Cable.type"
import type { CableDrag } from "../../data/CableDrag.type"
import { IDLE_DRAG } from "../../shared/Constants"
import { dropCable } from "../dropCable.process"

const usedOutput: OutputPort = deepFreeze({
  id: toObjectId("used-output"), moduleId: toObjectId("m1"), index: 0, kind: "output", node: "a"
})
const usedInput: InputPort = deepFreeze({
  id: toObjectId("used-input"), moduleId: toObjectId("m2"), index: 0, kind: "input", node: "b"
})
const freeOutput: OutputPort = deepFreeze({ ...usedOutput, id: toObjectId("free-output") })
const freeInput: InputPort = deepFreeze({ ...usedInput, id: toObjectId("free-input") })

// An already existing cable, so that "appended last" can be told apart from "prepended"
const existing: Cable = deepFreeze({ id: toObjectId("existing"), color: "blue", origin: usedOutput, destination: usedInput })
const cables: readonly Cable[] = deepFreeze([ existing ])

const magnetized = (connection: Connection): CableDrag =>
  deepFreeze({ step: "magnetized", origin: connection.origin, target: connection.destination, connection })

describe("dropCable", () => {
  it("creates the cable at the end of the list when both ports are still free, without any effect", () => {
    const connection = { origin: freeOutput, destination: freeInput }
    const created = { origin: freeOutput, destination: freeInput, id: null, color: "red" }

    expect(dropCable(magnetized(connection), cables)).toEqual({
      drag: IDLE_DRAG, cables: [ existing, created ], created, effects: []
    })
  })
  it("refuses the drop and disconnects the preview when the input has been occupied since magnetization", () => {
    const connection = { origin: freeOutput, destination: usedInput }

    expect(dropCable(magnetized(connection), cables)).toEqual({
      drag: IDLE_DRAG, cables: [ existing ], created: null,
      effects: [ { type: "cables.audio.disconnect", connection } ]
    })
  })
  it("refuses the drop and disconnects the preview when the output has been occupied since magnetization", () => {
    const connection = { origin: usedOutput, destination: freeInput }

    expect(dropCable(magnetized(connection), cables)).toEqual({
      drag: IDLE_DRAG, cables: [ existing ], created: null,
      effects: [ { type: "cables.audio.disconnect", connection } ]
    })
  })
  it("goes back to idle without creating anything when the cable was only started", () => {
    const drag: CableDrag = deepFreeze({ step: "started", origin: freeOutput })

    expect(dropCable(drag, cables)).toEqual({ drag: IDLE_DRAG, cables: [ existing ], created: null, effects: [] })
  })
  it("stays idle without creating anything when nothing was being dragged", () => {
    expect(dropCable(deepFreeze(IDLE_DRAG), cables)).toEqual({ drag: IDLE_DRAG, cables: [ existing ], created: null, effects: [] })
  })
})
