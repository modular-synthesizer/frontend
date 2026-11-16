import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { toObjectId, type ObjectId } from "../../../../shared/data/ObjectId.type"
import type { Connection } from "../../../core/data/Cable.type"
import { makeCableAudio, type NodesResolver, type VoiceNodes } from "../cable.audio"

type Op = "connect" | "disconnect"
type Call = { op: Op, from: string, to: string, output: number, input: number }
type FakeNode = { name: string }

const fakeNodes = () => {
  const calls: Call[] = []
  const record = (op: Op, from: string) => (target: FakeNode, output: number, input: number) => {
    calls.push({ op, from, to: target.name, output, input })
  }
  const node = (name: string): AudioNode =>
    ({ name, connect: record("connect", name), disconnect: record("disconnect", name) }) as unknown as AudioNode
  return { node, calls }
}

const fakeResolver = (modules: Record<string, readonly VoiceNodes[]>) => {
  const asked: ObjectId[] = []
  const resolve: NodesResolver = moduleId => {
    asked.push(moduleId)
    return modules[moduleId] ?? []
  }
  return { resolve, asked }
}

const oscId = toObjectId("osc")
const ampId = toObjectId("amp")

type Ends = { moduleId: ObjectId, node: string, index: number }

const connection = (origin: Ends, destination: Ends): Connection => ({
  origin: { ...origin, id: toObjectId("output_port"), kind: "output" },
  destination: { ...destination, id: toObjectId("input_port"), kind: "input" },
})

const oscToAmp = connection(
  { moduleId: oscId, node: "out", index: 1 },
  { moduleId: ampId, node: "in", index: 2 },
)

const throwingNode = (name: string): AudioNode =>
  ({
    name,
    connect: () => { throw new Error(`${name} cannot connect`) },
    disconnect: () => { throw new Error(`${name} cannot disconnect`) },
  }) as unknown as AudioNode

const captureErrors = () => {
  const original = console.error
  const errors: unknown[][] = []
  console.error = (...args: unknown[]) => { errors.push(args) }
  return { errors, restore: () => { console.error = original } }
}

describe("makeCableAudio", () => {
  describe("connect nodes", () => {
    it("connects each output voice to the input voice of the same rank, forwarding both indexes", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }, { out: node("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      makeCableAudio(resolve).connect(oscToAmp)

      expect(calls).toEqual([
        { op: "connect", from: "osc0", to: "amp0", output: 1, input: 2 },
        { op: "connect", from: "osc1", to: "amp1", output: 1, input: 2 },
      ])
    })

    it("connects a single voice once", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }],
        [ampId]: [{ in: node("amp0") }],
      })

      makeCableAudio(resolve).connect(oscToAmp)

      expect(calls).toEqual([{ op: "connect", from: "osc0", to: "amp0", output: 1, input: 2 }])
    })

    it("forwards indexes equal to 0 as they are", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }],
        [ampId]: [{ in: node("amp0") }],
      })

      makeCableAudio(resolve).connect(connection(
        { moduleId: oscId, node: "out", index: 0 },
        { moduleId: ampId, node: "in", index: 0 },
      ))

      expect(calls).toEqual([{ op: "connect", from: "osc0", to: "amp0", output: 0, input: 0 }])
    })

    it("looks for the output node in the origin module and the input node in the destination module", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc.out"), in: node("osc.in") }],
        [ampId]: [{ out: node("amp.out"), in: node("amp.in") }],
      })

      makeCableAudio(resolve).connect(oscToAmp)

      expect(calls).toEqual([{ op: "connect", from: "osc.out", to: "amp.in", output: 1, input: 2 }])
    })

    it("connects two nodes of the same module (feedback loop)", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("out0"), in: node("in0") }, { out: node("out1"), in: node("in1") }],
      })

      makeCableAudio(resolve).connect(connection(
        { moduleId: oscId, node: "out", index: 1 },
        { moduleId: oscId, node: "in", index: 2 },
      ))

      expect(calls).toEqual([
        { op: "connect", from: "out0", to: "in0", output: 1, input: 2 },
        { op: "connect", from: "out1", to: "in1", output: 1, input: 2 },
      ])
    })

    it("resolves the origin module and the destination module", () => {
      const { node } = fakeNodes()
      const { resolve, asked } = fakeResolver({
        [oscId]: [{ out: node("osc0") }],
        [ampId]: [{ in: node("amp0") }],
      })

      makeCableAudio(resolve).connect(oscToAmp)

      expect([...asked].sort()).toEqual([ampId, oscId])
    })

    it("never disconnects anything", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }, { out: node("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      makeCableAudio(resolve).connect(oscToAmp)

      expect(calls.map(c => c.op)).toEqual(["connect", "connect"])
    })
  })

  describe("connect modules with different voice counts", () => {
    it("only connects the voices present on both sides when the output has more voices", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }, { out: node("osc1") }],
        [ampId]: [{ in: node("amp0") }],
      })

      makeCableAudio(resolve).connect(oscToAmp)

      expect(calls).toEqual([{ op: "connect", from: "osc0", to: "amp0", output: 1, input: 2 }])
    })

    it("only connects the voices present on both sides when the input has more voices", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      makeCableAudio(resolve).connect(oscToAmp)

      expect(calls).toEqual([{ op: "connect", from: "osc0", to: "amp0", output: 1, input: 2 }])
    })

    it("connects nothing when the origin module is unknown", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      expect(() => makeCableAudio(resolve).connect(oscToAmp)).not.toThrow()
      expect(calls).toEqual([])
    })

    it("connects nothing when the destination module is unknown", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }, { out: node("osc1") }],
      })

      expect(() => makeCableAudio(resolve).connect(oscToAmp)).not.toThrow()
      expect(calls).toEqual([])
    })

    it("connects nothing when both modules are unknown", () => {
      const { calls } = fakeNodes()
      const { resolve } = fakeResolver({})

      expect(() => makeCableAudio(resolve).connect(oscToAmp)).not.toThrow()
      expect(calls).toEqual([])
    })
  })

  describe("connect with missing nodes", () => {
    let capture: ReturnType<typeof captureErrors>
    beforeEach(() => { capture = captureErrors() })
    afterEach(() => capture.restore())

    it("skips a voice whose output node is missing and connects the others", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{}, { out: node("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      makeCableAudio(resolve).connect(oscToAmp)

      expect(calls).toEqual([{ op: "connect", from: "osc1", to: "amp1", output: 1, input: 2 }])
      expect(capture.errors).toEqual([])
    })

    it("skips a voice whose input node is missing and connects the others", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }, { out: node("osc1") }],
        [ampId]: [{}, { in: node("amp1") }],
      })

      makeCableAudio(resolve).connect(oscToAmp)

      expect(calls).toEqual([{ op: "connect", from: "osc1", to: "amp1", output: 1, input: 2 }])
      expect(capture.errors).toEqual([])
    })

    it("connects nothing when the nodes are missing in every voice", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ other: node("osc0") }, { other: node("osc1") }],
        [ampId]: [{ other: node("amp0") }, { other: node("amp1") }],
      })

      expect(() => makeCableAudio(resolve).connect(oscToAmp)).not.toThrow()
      expect(calls).toEqual([])
      expect(capture.errors).toEqual([])
    })
  })

  describe("connect with failing nodes", () => {
    let capture: ReturnType<typeof captureErrors>
    beforeEach(() => { capture = captureErrors() })
    afterEach(() => capture.restore())

    it("connects the next voices when the first one fails, without throwing", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: throwingNode("osc0") }, { out: node("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      expect(() => makeCableAudio(resolve).connect(oscToAmp)).not.toThrow()
      expect(calls).toEqual([{ op: "connect", from: "osc1", to: "amp1", output: 1, input: 2 }])
    })

    it("does not throw when every voice fails", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: throwingNode("osc0") }, { out: throwingNode("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      expect(() => makeCableAudio(resolve).connect(oscToAmp)).not.toThrow()
      expect(calls).toEqual([])
    })

    it("keeps the previous voices connected when the last one fails", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }, { out: throwingNode("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      expect(() => makeCableAudio(resolve).connect(oscToAmp)).not.toThrow()
      expect(calls).toEqual([{ op: "connect", from: "osc0", to: "amp0", output: 1, input: 2 }])
    })

    it("logs one error per failing voice", () => {
      const { node } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: throwingNode("osc0") }, { out: node("osc1") }, { out: throwingNode("osc2") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }, { in: node("amp2") }],
      })

      makeCableAudio(resolve).connect(oscToAmp)

      expect(capture.errors).toHaveLength(2)
    })
  })

  describe("disconnect", () => {
    let capture: ReturnType<typeof captureErrors>
    beforeEach(() => { capture = captureErrors() })
    afterEach(() => capture.restore())

    it("disconnects each output voice from the input voice of the same rank, forwarding both indexes", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }, { out: node("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      makeCableAudio(resolve).disconnect(oscToAmp)

      expect(calls).toEqual([
        { op: "disconnect", from: "osc0", to: "amp0", output: 1, input: 2 },
        { op: "disconnect", from: "osc1", to: "amp1", output: 1, input: 2 },
      ])
    })

    it("forwards indexes equal to 0 as they are", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }],
        [ampId]: [{ in: node("amp0") }],
      })

      makeCableAudio(resolve).disconnect(connection(
        { moduleId: oscId, node: "out", index: 0 },
        { moduleId: ampId, node: "in", index: 0 },
      ))

      expect(calls).toEqual([{ op: "disconnect", from: "osc0", to: "amp0", output: 0, input: 0 }])
    })

    it("looks for the output node in the origin module and the input node in the destination module", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc.out"), in: node("osc.in") }],
        [ampId]: [{ out: node("amp.out"), in: node("amp.in") }],
      })

      makeCableAudio(resolve).disconnect(oscToAmp)

      expect(calls).toEqual([{ op: "disconnect", from: "osc.out", to: "amp.in", output: 1, input: 2 }])
    })

    it("resolves the origin module and the destination module", () => {
      const { node } = fakeNodes()
      const { resolve, asked } = fakeResolver({
        [oscId]: [{ out: node("osc0") }],
        [ampId]: [{ in: node("amp0") }],
      })

      makeCableAudio(resolve).disconnect(oscToAmp)

      expect([...asked].sort()).toEqual([ampId, oscId])
    })

    it("only disconnects the voices present on both sides when the output has more voices", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }, { out: node("osc1") }],
        [ampId]: [{ in: node("amp0") }],
      })

      makeCableAudio(resolve).disconnect(oscToAmp)

      expect(calls).toEqual([{ op: "disconnect", from: "osc0", to: "amp0", output: 1, input: 2 }])
      expect(capture.errors).toEqual([])
    })

    it("only disconnects the voices present on both sides when the input has more voices", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      makeCableAudio(resolve).disconnect(oscToAmp)

      expect(calls).toEqual([{ op: "disconnect", from: "osc0", to: "amp0", output: 1, input: 2 }])
    })

    it("disconnects nothing when the origin module is unknown", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      expect(() => makeCableAudio(resolve).disconnect(oscToAmp)).not.toThrow()
      expect(calls).toEqual([])
    })

    it("skips a voice whose output node is missing and disconnects the others", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{}, { out: node("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      makeCableAudio(resolve).disconnect(oscToAmp)

      expect(calls).toEqual([{ op: "disconnect", from: "osc1", to: "amp1", output: 1, input: 2 }])
      expect(capture.errors).toEqual([])
    })

    it("skips a voice whose input node is missing and disconnects the others", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }, { out: node("osc1") }],
        [ampId]: [{}, { in: node("amp1") }],
      })

      makeCableAudio(resolve).disconnect(oscToAmp)

      expect(calls).toEqual([{ op: "disconnect", from: "osc1", to: "amp1", output: 1, input: 2 }])
      expect(capture.errors).toEqual([])
    })

    it("disconnects the next voices when the first one fails, without throwing", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: throwingNode("osc0") }, { out: node("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      expect(() => makeCableAudio(resolve).disconnect(oscToAmp)).not.toThrow()
      expect(calls).toEqual([{ op: "disconnect", from: "osc1", to: "amp1", output: 1, input: 2 }])
      expect(capture.errors).toHaveLength(1)
    })

    it("does not throw when every voice fails", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: throwingNode("osc0") }, { out: throwingNode("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      expect(() => makeCableAudio(resolve).disconnect(oscToAmp)).not.toThrow()
      expect(calls).toEqual([])
    })

    it("never connects anything", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }, { out: node("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })

      makeCableAudio(resolve).disconnect(oscToAmp)

      expect(calls.map(c => c.op)).toEqual(["disconnect", "disconnect"])
    })
  })

  describe("resolution on each call", () => {
    it("resolves the voices again on each call", () => {
      const { node, calls } = fakeNodes()
      const modules: Record<string, readonly VoiceNodes[]> = {
        [oscId]: [{ out: node("osc0") }],
        [ampId]: [{ in: node("amp0") }],
      }
      const { resolve } = fakeResolver(modules)
      const audio = makeCableAudio(resolve)

      audio.connect(oscToAmp)
      modules[oscId] = [{ out: node("osc0") }, { out: node("osc1") }]
      modules[ampId] = [{ in: node("amp0") }, { in: node("amp1") }]
      audio.connect(oscToAmp)

      expect(calls).toEqual([
        { op: "connect", from: "osc0", to: "amp0", output: 1, input: 2 },
        { op: "connect", from: "osc0", to: "amp0", output: 1, input: 2 },
        { op: "connect", from: "osc1", to: "amp1", output: 1, input: 2 },
      ])
    })

    it("disconnects with the same nodes and indexes as the previous connection", () => {
      const { node, calls } = fakeNodes()
      const { resolve } = fakeResolver({
        [oscId]: [{ out: node("osc0") }, { out: node("osc1") }],
        [ampId]: [{ in: node("amp0") }, { in: node("amp1") }],
      })
      const audio = makeCableAudio(resolve)

      audio.connect(oscToAmp)
      audio.disconnect(oscToAmp)

      expect(calls).toEqual([
        { op: "connect", from: "osc0", to: "amp0", output: 1, input: 2 },
        { op: "connect", from: "osc1", to: "amp1", output: 1, input: 2 },
        { op: "disconnect", from: "osc0", to: "amp0", output: 1, input: 2 },
        { op: "disconnect", from: "osc1", to: "amp1", output: 1, input: 2 },
      ])
    })
  })
})
