import { describe, expectTypeOf, it } from "vitest"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import type { Cable, Connection, SavedCable } from "../Cable.type"
import type { InputPort, OutputPort } from "../Port.type"

const output: OutputPort = { id: toObjectId("out"), moduleId: toObjectId("osc"), kind: "output", node: "osc", index: 0 }
const input: InputPort = { id: toObjectId("in"), moduleId: toObjectId("filter"), kind: "input", node: "filter", index: 0 }

describe("Connection", () => {
  it("goes from an output to an input", () => {
    expectTypeOf({ origin: output, destination: input }).toExtend<Connection>()
  })
  it("refuses an input as origin", () => {
    // @ts-expect-error an input cannot be the origin of a connection
    const connection: Connection = { origin: input, destination: input }
    expectTypeOf(connection).not.toBeAny()
  })
  it("refuses an output as destination", () => {
    // @ts-expect-error an output cannot be the destination of a connection
    const connection: Connection = { origin: output, destination: output }
    expectTypeOf(connection).not.toBeAny()
  })
})

describe("Cable", () => {
  it("accepts a null id while pending", () => {
    expectTypeOf({ origin: output, destination: input, id: null, color: "red" as const }).toExtend<Cable>()
  })
})

describe("SavedCable", () => {
  it("accepts an id", () => {
    expectTypeOf({ origin: output, destination: input, id: toObjectId("cable"), color: "red" as const }).toExtend<SavedCable>()
  })
  it("refuses a null id", () => {
    // @ts-expect-error a saved cable always has an id
    const cable: SavedCable = { origin: output, destination: input, id: null, color: "red" }
    expectTypeOf(cable).not.toBeAny()
  })
})
