// features/cables/core/shared/__tests__/connection.test.ts (partie orient)
import { describe, expect, it } from "vitest"
import { ko, ok } from "../../../../shared/results/result"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import type { InputPort, OutputPort } from "../../data/Port.type"
import type { Cable, Connection } from "../../data/Cable.type"
import { accepts, isPending, orient, sameConnection, touches } from "../connection"

const output = (id: string): OutputPort =>
  deepFreeze({ id: toObjectId(id), moduleId: toObjectId("oscillator"), kind: "output", node: "osc", index: 0 })

const input = (id: string): InputPort =>
  deepFreeze({ id: toObjectId(id), moduleId: toObjectId("filter"), kind: "input", node: "filter", index: 0 })

const cables = (...connections: Connection[]): readonly Connection[] => deepFreeze(connections)

describe("orient", () => {
  describe("with an output and an input", () => {
    it("places the output in origin when given first", () => {
      expect(orient(output("out"), input("in"))).toStrictEqual(ok({ origin: output("out"), destination: input("in") }))
    })
    it("places the output in origin when given second", () => {
      expect(orient(input("in"), output("out"))).toStrictEqual(ok({ origin: output("out"), destination: input("in") }))
    })
    it("keeps the very same port objects", () => {
      const origin = output("out")
      const destination = input("in")
      const connection = orient(destination, origin).orNull()
      expect(connection?.origin).toBe(origin)
      expect(connection?.destination).toBe(destination)
    })
  })
  describe("with two ports of the same kind", () => {
    it("refuses two outputs", () => {
      expect(orient(output("a"), output("b"))).toStrictEqual(ko("cable.kinds.identical"))
    })
    it("refuses two inputs", () => {
      expect(orient(input("a"), input("b"))).toStrictEqual(ko("cable.kinds.identical"))
    })
    it("refuses an output with itself", () => {
      const port = output("out")
      expect(orient(port, port)).toStrictEqual(ko("cable.kinds.identical"))
    })
    it("refuses an input with itself", () => {
      const port = input("in")
      expect(orient(port, port)).toStrictEqual(ko("cable.kinds.identical"))
    })
  })
})

describe("accepts", () => {
  it("accepts any port when there is no cable", () => {
    expect(accepts(cables(), output("out"))).toBe(true)
    expect(accepts(cables(), input("in"))).toBe(true)
  })
  describe("with a free port", () => {
    it("accepts an output even if another output of the same module is used", () => {
      const list = cables({ origin: output("used"), destination: input("in") })
      expect(accepts(list, output("free"))).toBe(true)
    })
    it("accepts an input even if another input of the same module is occupied", () => {
      const list = cables({ origin: output("out"), destination: input("used") })
      expect(accepts(list, input("free"))).toBe(true)
    })
  })
  describe("with a busy port", () => {
    it("refuses an output already used as origin", () => {
      const list = cables({ origin: output("out"), destination: input("in") })
      expect(accepts(list, output("out"))).toBe(false)
    })
    it("refuses an input already used as destination", () => {
      const list = cables({ origin: output("out"), destination: input("in") })
      expect(accepts(list, input("in"))).toBe(false)
    })
    it("refuses a port used by a cable that is not the first of the list", () => {
      const list = cables(
        { origin: output("a"), destination: input("b") },
        { origin: output("c"), destination: input("d") },
      )
      expect(accepts(list, output("c"))).toBe(false)
      expect(accepts(list, input("d"))).toBe(false)
    })
  })
  describe("comparison", () => {
    it("compares ports by id only, not by reference nor other fields", () => {
      const list = cables({ origin: output("out"), destination: input("in") })
      const sameId: OutputPort = deepFreeze({ ...output("out"), moduleId: toObjectId("other"), node: "other", index: 3 })
      expect(accepts(list, sameId)).toBe(false)
    })
    it("ignores the kind of the port", () => {
      const list = cables({ origin: output("shared"), destination: input("in") })
      expect(accepts(list, input("shared"))).toBe(false)
    })
  })
})

describe("touches", () => {
  const connection: Connection = deepFreeze({ origin: output("out"), destination: input("in") })

  it("is true for the module of the origin", () => {
    expect(touches(connection, toObjectId("oscillator"))).toBe(true)
  })
  it("is true for the module of the destination", () => {
    expect(touches(connection, toObjectId("filter"))).toBe(true)
  })
  it("is false for another module", () => {
    expect(touches(connection, toObjectId("other"))).toBe(false)
  })
  it("is true when both ports belong to the module", () => {
    const loop: Connection = deepFreeze({ origin: output("out"), destination: { ...input("in"), moduleId: toObjectId("oscillator") } })
    expect(touches(loop, toObjectId("oscillator"))).toBe(true)
  })
  it("compares module ids, not port ids", () => {
    expect(touches(connection, toObjectId("out"))).toBe(false)
    expect(touches(connection, toObjectId("in"))).toBe(false)
  })
})

const connect = (origin: OutputPort, destination: InputPort): Connection => deepFreeze({ origin, destination })

describe("sameConnection", () => {
  describe("with the same port ids", () => {
    it("is true for the very same connection", () => {
      const connection = connect(output("out"), input("in"))
      expect(sameConnection(connection, connection)).toBe(true)
    })
    it("is true for different objects carrying the same ids", () => {
      expect(sameConnection(connect(output("out"), input("in")), connect(output("out"), input("in")))).toBe(true)
    })
    it("is true even if the other fields of the ports differ", () => {
      const other = connect(
        deepFreeze({ ...output("out"), moduleId: toObjectId("other"), node: "other", index: 2 }),
        deepFreeze({ ...input("in"), moduleId: toObjectId("other"), node: "other", index: 3 }),
      )
      expect(sameConnection(connect(output("out"), input("in")), other)).toBe(true)
    })
  })
  describe("with different port ids", () => {
    it("is false when only the origin differs", () => {
      expect(sameConnection(connect(output("out"), input("in")), connect(output("other"), input("in")))).toBe(false)
    })
    it("is false when only the destination differs", () => {
      expect(sameConnection(connect(output("out"), input("in")), connect(output("out"), input("other")))).toBe(false)
    })
    it("is false when both ports differ", () => {
      expect(sameConnection(connect(output("a"), input("b")), connect(output("c"), input("d")))).toBe(false)
    })
    it("is false when the ids are crossed", () => {
      expect(sameConnection(connect(output("a"), input("b")), connect(output("b"), input("a")))).toBe(false)
    })
  })
})

const pending = (connection: Connection): Cable => deepFreeze({ ...connection, id: null, color: "red" })
const saved = (connection: Connection): Cable => deepFreeze({ ...connection, id: toObjectId("saved"), color: "red" })

describe("isPending", () => {
  const connection = connect(output("out"), input("in"))

  it("is true for a cable without id on the same ports", () => {
    expect(isPending(pending(connection), connection)).toBe(true)
  })
  it("is false for a saved cable on the same ports", () => {
    expect(isPending(saved(connection), connection)).toBe(false)
  })
  it("is false for a pending cable sharing only the output", () => {
    expect(isPending(pending(connect(output("out"), input("other"))), connection)).toBe(false)
  })
  it("is false for a pending cable sharing only the input", () => {
    expect(isPending(pending(connect(output("other"), input("in"))), connection)).toBe(false)
  })
})