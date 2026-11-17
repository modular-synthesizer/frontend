import { describe, expect, it } from "vitest";
import type { Control, AudioModule as LegacyModule, Port as LegacyPort } from "~/types/Index";
import { makeCables, toPort, portPosition, type CablesContext, type Store, type CablesAdapter, resolveNodes, refStore } from "../cables.adapter"
import type { Cable, Connection } from "../../../core/data/Cable.type"
import type { CableDrag } from "../../../core/data/CableDrag.type"
import type { CablesEffect } from "../../../core/data/Effect.type"
import { IDLE_DRAG } from "../../../core/shared/Constants"
import { toObjectId, type ObjectId } from "../../../../shared/data/ObjectId.type"
import type { HttpError } from "../../../../shared/http/http";
import { ko, ok, type Result } from "../../../../shared/results/result";
import type { Channel } from "~/types/modules/Channel";
import { ref } from "vue"

const memoryStore = <T>(initial: T): Store<T> & { history: T[] } => {
  let value = initial
  const history: T[] = []
  return { get: () => value, set: v => { value = v; history.push(v) }, history }
}

const runRecorder = (onRun?: (effect: CablesEffect) => void) => {
  const effects: CablesEffect[] = []
  const log: string[] = []
  const run = async (effect: CablesEffect) => {
    log.push(`start:${effect.type}`)
    effects.push(effect)
    onRun?.(effect)
    await Promise.resolve()
    log.push(`end:${effect.type}`)
  }
  return { run, effects, log }
}

const legacyModule = (id: string, ports: { id: string, kind: "input" | "output", target: string }[]): LegacyModule => {
  const mod = { id, x: 0, y: 0, controls: [], channels: [], ports: [] } as unknown as LegacyModule
  mod.ports = ports.map(p => ({ ...p, name: p.id, index: 0, link: undefined, mod })) as LegacyPort[]
  return mod
}

const osc = legacyModule("osc", [ { id: "osc.out", kind: "output", target: "out" }, { id: "osc.out2", kind: "output", target: "out2" } ])
const amp = legacyModule("amp", [ { id: "amp.in", kind: "input", target: "in" } ])
const [ out, out2 ] = osc.ports as [ LegacyPort, LegacyPort ]
const [ input ] = amp.ports as [ LegacyPort ]


const connection: Connection = { origin: toPort(out), destination: toPort(input) } as Connection

const magnetized: CableDrag = { step: "magnetized", origin: toPort(out), target: toPort(input), connection }

const lfo = legacyModule("lfo", [ { id: "lfo.out", kind: "output", target: "out" } ])
const vcf = legacyModule("vcf", [ { id: "vcf.in", kind: "input", target: "in" } ])
const [ lfoOut ] = lfo.ports as [ LegacyPort ]
const [ vcfIn ] = vcf.ports as [ LegacyPort ]
const otherConnection = { origin: toPort(lfoOut), destination: toPort(vcfIn) } as Connection
const otherCable: Cable = { ...otherConnection, id: toObjectId("other.id"), color: "blue" }

const setup = (
  drag: CableDrag = IDLE_DRAG,
  cables: Cable[] = [],
  onRun?: (e: CablesEffect) => void,
  modules: () => readonly LegacyModule[] = () => [ osc, amp ],
) => {
  const dragStore = memoryStore(drag)
  const cablesStore = memoryStore(cables)
  const recorder = runRecorder(onRun)
  const context: CablesContext = {
    synthesizerId: toObjectId("synth"),
    modules,
    drag: dragStore,
    cables: cablesStore,
    create: async () => { throw new Error("create should not be called") },
    run: recorder.run,
  }
  return { adapter: makeCables(context), dragStore, cablesStore, ...recorder }
}

describe("toPort", () => {
  it("correctly maps all field of a legacy port", () => {
    const legacy: LegacyPort = {
      id: "portId",
      name: "port",
      target: "target",
      index: 1,
      kind: "output",
      mod: { id: "modId" } as LegacyModule
    }
    expect(toPort(legacy)).toEqual({
      id: "portId",
      moduleId: "modId",
      kind: "output",
      node: "target",
      index: 1
    })
  })
})

const cableId = toObjectId("cable.id")
const savedCable: Cable = { ...connection, id: cableId, color: "red" }
const pendingCable: Cable = { ...connection, id: null, color: "red" }
const apiLink = { id: "cable.id", from: "osc.out", to: "amp.in", color: "red" }

type CreateCall = { synthesizerId: ObjectId, cable: Cable, cablesAtCall: Cable[], dragAtCall: CableDrag }

const dropSetup = (
  drag: CableDrag,
  response: Result<ObjectId, HttpError>,
  cables: Cable[] = [],
  during?: (adapter: CablesAdapter) => Promise<void>,
) => {
  const dragStore = memoryStore(drag)
  const cablesStore = memoryStore(cables)
  const recorder = runRecorder()
  const createCalls: CreateCall[] = []
  let adapter: CablesAdapter
  const context: CablesContext = {
    synthesizerId: toObjectId("synth"),
    modules: () => [ osc, amp ],
    drag: dragStore,
    cables: cablesStore,
    create: async (synthesizerId, cable) => {
      createCalls.push({ synthesizerId, cable, cablesAtCall: cablesStore.get(), dragAtCall: dragStore.get() })
      if (during) await during(adapter)
      return response
    },
    run: recorder.run,
  }
  adapter = makeCables(context)
  return { adapter, dragStore, cablesStore, createCalls, ...recorder }
}

describe("portPosition", () => {
  const control: Control = {
    component: "Port", id: "controlId", payload: { target: "port", x: 20, y: 15 }
  }
  const legacy: LegacyPort = {
    id: "portId",
    name: "port",
    target: "target",
    index: 0,
    kind: "output",
    mod: { id: "modId", controls: [] as Control[], x: 11, y: 6 } as LegacyModule
  }
  it("returns the sum of the coordinates of the control and the module if a control is found", () => {
    const mod = { id: "modId", controls: [ control ] as Control[], x: 11, y: 6 } as LegacyModule
    const port = { ...legacy, mod }
    expect(portPosition(port)).toEqual({ x: 31, y: 21 })
  })
  it("returns the coordinates of the module if a control is not found", () => {
    expect(portPosition(legacy)).toEqual({ x: 11, y: 6 })
  })
  it("converts the coordinates of the control given as strings", () => {
    const stringControl: Control = {
      component: "Port", id: "controlId", payload: { target: "port", x: "12", y: "7" }
    }
    const port = { ...legacy, mod: { ...legacy.mod, controls: [ stringControl ] } as LegacyModule }
    expect(portPosition(port)).toEqual({ x: 23, y: 13 })
  })

  it("ignores a control of another component with the same target", () => {
    const knob: Control = {
      component: "Knob", id: "knobId", payload: { target: "port", x: 100, y: 100 }
    }
    const port = { ...legacy, mod: { ...legacy.mod, controls: [ knob, control ] } as LegacyModule }
    expect(portPosition(port)).toEqual({ x: 31, y: 21 })
  })

  it("ignores a port control targeting another port", () => {
    const other: Control = {
      component: "Port", id: "otherId", payload: { target: "other", x: 100, y: 100 }
    }
    const port = { ...legacy, mod: { ...legacy.mod, controls: [ other, control ] } as LegacyModule }
    expect(portPosition(port)).toEqual({ x: 31, y: 21 })
  })

  it("uses 0 for a missing coordinate of the control", () => {
    const partial: Control = { component: "Port", id: "controlId", payload: { target: "port", x: 20 } }
    const port = { ...legacy, mod: { ...legacy.mod, controls: [ partial ] } as LegacyModule }
    expect(portPosition(port)).toEqual({ x: 31, y: 6 })
  })
})

const fakeNode = (name: string) => ({ name }) as unknown as AudioNode

const channel = (index: number, nodes: Record<string, AudioNode>): Channel =>
  ({ index, nodes, links: [], used: true })

const moduleWithChannels = (id: string, channels: Channel[]): LegacyModule =>
  ({ id, channels, ports: [], controls: [], x: 0, y: 0 }) as unknown as LegacyModule

describe("resolveNodes", () => {
  const osc0 = fakeNode("osc0")
  const osc1 = fakeNode("osc1")
  const oscModule = moduleWithChannels("osc", [ channel(0, { out: osc0 }), channel(1, { out: osc1 }) ])
  const ampModule = moduleWithChannels("amp", [ channel(0, { in: fakeNode("amp0") }) ])

  it("returns the nodes of each channel of the module, in order", () => {
    const resolve = resolveNodes(() => [ ampModule, oscModule ])
    expect(resolve(toObjectId("osc"))).toEqual([ { out: osc0 }, { out: osc1 } ])
  })

  it("returns the nodes objects themselves", () => {
    const resolve = resolveNodes(() => [ oscModule ])
    expect(resolve(toObjectId("osc"))[1]).toBe(oscModule.channels[1]!.nodes)
  })

  it("returns an empty list for an unknown module", () => {
    const resolve = resolveNodes(() => [ oscModule ])
    expect(resolve(toObjectId("unknown"))).toEqual([])
  })

  it("returns an empty list for a module without channels", () => {
    const resolve = resolveNodes(() => [ moduleWithChannels("empty", []) ])
    expect(resolve(toObjectId("empty"))).toEqual([])
  })

  it("finds a module added after the creation of the resolver", () => {
    const modules: LegacyModule[] = [ oscModule ]
    const resolve = resolveNodes(() => modules)
    modules.push(ampModule)
    expect(resolve(toObjectId("amp"))).toHaveLength(1)
  })

  it("does not find a module removed after the creation of the resolver", () => {
    let modules: LegacyModule[] = [ oscModule, ampModule ]
    const resolve = resolveNodes(() => modules)
    modules = [ oscModule ]
    expect(resolve(toObjectId("amp"))).toEqual([])
  })
})

describe("refStore", () => {
  it("reads the current value of the ref", () => {
    const source = ref(1)
    const store = refStore(source)
    source.value = 2
    expect(store.get()).toBe(2)
  })

  it("writes into the ref", () => {
    const source = ref(1)
    refStore(source).set(3)
    expect(source.value).toBe(3)
  })

  it("keeps the content of a written object", () => {
    const source = ref<Cable[]>([])
    const cables: Cable[] = [ savedCable ]
    refStore(source).set(cables)
    expect(source.value).toEqual([ savedCable ])
  })
})

describe("makeCables", () => {
  describe("drag", () => {
    it("returns the current value of the store", () => {
      const started: CableDrag = { step: "started", origin: toPort(out) }
      const { adapter } = setup(started)
      expect(adapter.drag()).toEqual(started)
    })

    it("follows the changes made by the actions", async () => {
      const { adapter } = setup()
      await adapter.start(out)
      expect(adapter.drag().step).toBe("started")
    })
  })

  describe("start", () => {
    it("starts a cable from an output, without effects", async () => {
      const { adapter, effects, cablesStore } = setup()
      await adapter.start(out)
      expect(adapter.drag()).toEqual({ step: "started", origin: toPort(out) })
      expect(effects).toEqual([])
      expect(cablesStore.history).toEqual([])
    })

    it("starts a cable from an input", async () => {
      const { adapter } = setup()
      await adapter.start(input)
      expect(adapter.drag()).toEqual({ step: "started", origin: toPort(input) })
    })

    it("disconnects the magnetized cable when starting another one", async () => {
      const { adapter, effects } = setup(magnetized)
      await adapter.start(out2)
      expect(adapter.drag()).toEqual({ step: "started", origin: toPort(out2) })
      expect(effects).toEqual([ { type: "cables.audio.disconnect", connection } ])
    })

    it("stays idle when the port already has a cable", async () => {
      const saved: Cable = { ...connection, id: toObjectId("cable"), color: "red" }
      const { adapter, effects } = setup(IDLE_DRAG, [ saved ])
      await adapter.start(out)
      expect(adapter.drag()).toEqual(IDLE_DRAG)
      expect(effects).toEqual([])
    })
  })

  describe("magnetize", () => {
    it("magnetizes a started cable and connects the audio", async () => {
      const { adapter, effects } = setup({ step: "started", origin: toPort(out) })
      await adapter.magnetize(input)
      expect(adapter.drag()).toEqual(magnetized)
      expect(effects).toEqual([ { type: "cables.audio.connect", connection } ])
    })

    it("orients the connection from the output when started from an input", async () => {
      const { adapter, effects } = setup({ step: "started", origin: toPort(input) })
      await adapter.magnetize(out)
      expect(effects).toEqual([ { type: "cables.audio.connect", connection } ])
    })

    it("does nothing on a port of the same kind", async () => {
      const started: CableDrag = { step: "started", origin: toPort(out) }
      const { adapter, effects } = setup(started)
      await adapter.magnetize(out2)
      expect(adapter.drag()).toEqual(started)
      expect(effects).toEqual([])
    })

    it("does nothing when idle", async () => {
      const { adapter, effects } = setup()
      await adapter.magnetize(input)
      expect(adapter.drag()).toEqual(IDLE_DRAG)
      expect(effects).toEqual([])
    })

    it("writes the store before running the effects", async () => {
      const seen: string[] = []
      const { adapter, dragStore } = setup({ step: "started", origin: toPort(out) }, [], () => seen.push(dragStore.get().step))
      await adapter.magnetize(input)
      expect(seen).toEqual([ "magnetized" ])
    })
  })

  describe("unmagnetize", () => {
    it("goes back to started and disconnects the audio", async () => {
      const { adapter, effects } = setup(magnetized)
      await adapter.unmagnetize(input)
      expect(adapter.drag()).toEqual({ step: "started", origin: toPort(out) })
      expect(effects).toEqual([ { type: "cables.audio.disconnect", connection } ])
    })

    it("does nothing when leaving another port than the target", async () => {
      const { adapter, effects } = setup(magnetized)
      await adapter.unmagnetize(out2)
      expect(adapter.drag()).toEqual(magnetized)
      expect(effects).toEqual([])
    })

    it("does nothing when only started", async () => {
      const started: CableDrag = { step: "started", origin: toPort(out) }
      const { adapter, effects } = setup(started)
      await adapter.unmagnetize(input)
      expect(adapter.drag()).toEqual(started)
      expect(effects).toEqual([])
    })

    it("writes the store before running the effects", async () => {
      const seen: string[] = []
      const { adapter, dragStore } = setup(magnetized, [], () => seen.push(dragStore.get().step))
      await adapter.unmagnetize(input)
      expect(seen).toEqual([ "started" ])
    })
  })

  describe("cancel", () => {
    it("goes back to idle and disconnects a magnetized cable", async () => {
      const { adapter, effects } = setup(magnetized)
      await adapter.cancel()
      expect(adapter.drag()).toEqual(IDLE_DRAG)
      expect(effects).toEqual([ { type: "cables.audio.disconnect", connection } ])
    })

    it("goes back to idle without effects when only started", async () => {
      const { adapter, effects } = setup({ step: "started", origin: toPort(out) })
      await adapter.cancel()
      expect(adapter.drag()).toEqual(IDLE_DRAG)
      expect(effects).toEqual([])
    })

    it("does nothing when idle", async () => {
      const { adapter, effects } = setup()
      await expect(adapter.cancel()).resolves.toBeUndefined()
      expect(adapter.drag()).toEqual(IDLE_DRAG)
      expect(effects).toEqual([])
    })
  })

  describe("drop", () => {
    it("creates the pending cable once, with the stores already written", async () => {
      const { adapter, createCalls } = dropSetup(magnetized, ok(cableId))
      await adapter.drop()
      expect(createCalls).toEqual([ {
        synthesizerId: toObjectId("synth"),
        cable: pendingCable,
        cablesAtCall: [ pendingCable ],
        dragAtCall: IDLE_DRAG,
      } ])
    })

    it("identifies the cable with the id of the response, without effects", async () => {
      const { adapter, cablesStore, effects } = dropSetup(magnetized, ok(cableId))
      await adapter.drop()
      expect(cablesStore.get()).toEqual([ savedCable ])
      expect(adapter.drag()).toEqual(IDLE_DRAG)
      expect(effects).toEqual([])
    })

    it("keeps a single cable when the notification arrives during the request", async () => {
      const { adapter, cablesStore, effects } = dropSetup(magnetized, ok(cableId), [],
        a => a.receiveAdded(apiLink))
      await adapter.drop()
      expect(cablesStore.get()).toEqual([ savedCable ])
      expect(effects).toEqual([])
    })

    it("deletes the cable on the server when removed during the request", async () => {
      const { adapter, cablesStore, effects } = dropSetup(magnetized, ok(cableId), [],
        a => a.remove(connection))
      await adapter.drop()
      expect(cablesStore.get()).toEqual([])
      expect(effects).toEqual([
        { type: "cables.audio.disconnect", connection },
        { type: "cables.cable.delete", id: cableId },
      ])
    })

    it("removes and disconnects the pending cable when the creation fails", async () => {
      const { adapter, cablesStore, effects } = dropSetup(magnetized, ko({ status: 500 } as HttpError))
      await adapter.drop()
      expect(cablesStore.get()).toEqual([])
      expect(effects).toEqual([ { type: "cables.audio.disconnect", connection } ])
    })

    it("does not create anything when the cable is not magnetized", async () => {
      const started: CableDrag = { step: "started", origin: toPort(out) }
      const { adapter, createCalls, cablesStore, effects } = dropSetup(started, ok(cableId))
      await adapter.drop()
      expect(createCalls).toEqual([])
      expect(adapter.drag()).toEqual(IDLE_DRAG)
      expect(cablesStore.get()).toEqual([])
      expect(effects).toEqual([])
    })

    it("disconnects without creating when a port was taken in the meantime", async () => {
      const other: Cable = {
        origin: toPort(out2), destination: toPort(input), id: toObjectId("other"), color: "blue",
      } as Cable
      const { adapter, createCalls, cablesStore, effects } = dropSetup(magnetized, ok(cableId), [ other ])
      await adapter.drop()
      expect(createCalls).toEqual([])
      expect(cablesStore.get()).toEqual([ other ])
      expect(effects).toEqual([ { type: "cables.audio.disconnect", connection } ])
    })
  })

  describe("receiveAdded", () => {
    it("adds the received cable with its id and color, and connects the audio", async () => {
      const { adapter, cablesStore, effects } = setup()
      await adapter.receiveAdded({ ...apiLink, color: "blue" })
      expect(cablesStore.get()).toEqual([ { ...connection, id: cableId, color: "blue" } ])
      expect(effects).toEqual([ { type: "cables.audio.connect", connection } ])
    })

    it("orients the cable from the output when the link goes from the input", async () => {
      const { adapter, cablesStore, effects } = setup()
      await adapter.receiveAdded({ ...apiLink, from: "amp.in", to: "osc.out" })
      expect(cablesStore.get()).toEqual([ savedCable ])
      expect(effects).toEqual([ { type: "cables.audio.connect", connection } ])
    })

    it("does not change the drag state", async () => {
      const started: CableDrag = { step: "started", origin: toPort(out2) }
      const { adapter } = setup(started)
      await adapter.receiveAdded(apiLink)
      expect(adapter.drag()).toEqual(started)
    })

    describe("ignores the link without throwing", () => {
      const cases: [ string, unknown ][] = [
        [ "an invalid payload", { id: "cable.id" } ],
        [ "a null payload", null ],
        [ "an unknown origin port", { ...apiLink, from: "unknown" } ],
        [ "an unknown destination port", { ...apiLink, to: "unknown" } ],
        [ "two ports of the same kind", { ...apiLink, from: "osc.out", to: "osc.out2" } ],
      ]

      it.each(cases)("with %s", async (_, payload) => {
        const { adapter, cablesStore, effects } = setup()
        await expect(adapter.receiveAdded(payload)).resolves.toBeUndefined()
        expect(cablesStore.get()).toEqual([])
        expect(effects).toEqual([])
      })
    })

    it("does nothing when the id is already known", async () => {
      const { adapter, cablesStore, effects } = setup(IDLE_DRAG, [ savedCable ])
      await adapter.receiveAdded(apiLink)
      expect(cablesStore.get()).toEqual([ savedCable ])
      expect(effects).toEqual([])
    })

    it("does not double a connection already present with another id", async () => {
      const { adapter, cablesStore, effects } = setup(IDLE_DRAG, [ savedCable ])
      await adapter.receiveAdded({ ...apiLink, id: "other.id" })
      expect(cablesStore.get()).toEqual([ savedCable ])
      expect(effects).toEqual([])
    })
    it("finds the ports of a module added after the creation of the adapter", async () => {
      const modules: LegacyModule[] = [ osc ]
      const { adapter, cablesStore } = setup(IDLE_DRAG, [], undefined, () => modules)
      modules.push(amp)
      await adapter.receiveAdded(apiLink)
      expect(cablesStore.get()).toEqual([ savedCable ])
    })
  })

  describe("effects execution", () => {
    it("waits for the effects before resolving", async () => {
      const { adapter, log } = setup({ step: "started", origin: toPort(out) })
      await adapter.magnetize(input)
      expect(log).toEqual([ "start:cables.audio.connect", "end:cables.audio.connect" ])
    })

    it("propagates an error raised by run", async () => {
      const { adapter } = setup({ step: "started", origin: toPort(out) })
      const failing = makeCables({
        synthesizerId: toObjectId("synth"), modules: () => [ osc, amp ],
        drag: memoryStore<CableDrag>({ step: "started", origin: toPort(out) }), cables: memoryStore<Cable[]>([]),
        create: async () => { throw new Error("unused") },
        run: async () => { throw new Error("audio failure") },
      })
      await expect(failing.magnetize(input)).rejects.toThrow("audio failure")
      void adapter
    })
  })

  describe("remove", () => {
    it("removes a saved cable, disconnects it and deletes it", async () => {
      const { adapter, cablesStore, effects } = setup(IDLE_DRAG, [ savedCable, otherCable ])
      await adapter.remove(connection)
      expect(cablesStore.get()).toEqual([ otherCable ])
      expect(effects).toEqual([
        { type: "cables.audio.disconnect", connection },
        { type: "cables.cable.delete", id: cableId },
      ])
    })

    it("does nothing for an unknown connection", async () => {
      const { adapter, cablesStore, effects } = setup(IDLE_DRAG, [ otherCable ])
      await adapter.remove(connection)
      expect(cablesStore.get()).toEqual([ otherCable ])
      expect(effects).toEqual([])
    })
  })

  describe("unplugModule", () => {
    it("removes the cables of the module and keeps the others", async () => {
      const { adapter, cablesStore, effects } = setup(IDLE_DRAG, [ savedCable, otherCable ])
      await adapter.unplugModule(amp)
      expect(cablesStore.get()).toEqual([ otherCable ])
      expect(effects).toEqual([
        { type: "cables.audio.disconnect", connection },
        { type: "cables.cable.delete", id: cableId },
      ])
    })

    it("works from the origin module too", async () => {
      const { adapter, cablesStore } = setup(IDLE_DRAG, [ savedCable, otherCable ])
      await adapter.unplugModule(osc)
      expect(cablesStore.get()).toEqual([ otherCable ])
    })

    it("runs the effects one after the other, in order", async () => {
      const { adapter, log } = setup(IDLE_DRAG, [ savedCable ])
      await adapter.unplugModule(amp)
      expect(log).toEqual([
        "start:cables.audio.disconnect", "end:cables.audio.disconnect",
        "start:cables.cable.delete", "end:cables.cable.delete",
      ])
    })
  })

  describe("load", () => {
    const secondLink = { id: "second.id", from: "osc.out2", to: "vcf.in", color: "green" }
    const modules = () => [ osc, amp, vcf ]
    const second = { origin: toPort(out2), destination: toPort(vcfIn) } as Connection

    it("adds the valid cables in order, skipping the invalid ones", async () => {
      const { adapter, cablesStore, effects } = setup(IDLE_DRAG, [], undefined, modules)
      await adapter.load([ apiLink, { invalid: true }, secondLink ])
      expect(cablesStore.get()).toEqual([
        savedCable,
        { ...second, id: toObjectId("second.id"), color: "green" },
      ])
      expect(effects).toEqual([
        { type: "cables.audio.connect", connection },
        { type: "cables.audio.connect", connection: second },
      ])
    })

    it("waits for every effect before resolving", async () => {
      const { adapter, log } = setup(IDLE_DRAG, [], undefined, modules)
      await adapter.load([ apiLink, secondLink ])
      expect(log).toEqual([
        "start:cables.audio.connect", "end:cables.audio.connect",
        "start:cables.audio.connect", "end:cables.audio.connect",
      ])
    })

    it("does nothing with an empty list", async () => {
      const { adapter, cablesStore, effects } = setup()
      await adapter.load([])
      expect(cablesStore.history).toEqual([])
      expect(effects).toEqual([])
    })
  })

  describe("portOf", () => {
    it("returns the legacy port itself", () => {
      const { adapter } = setup()
      expect(adapter.portOf(toPort(input))).toBe(input)
    })

    it("returns undefined for an unknown port", () => {
      const { adapter } = setup()
      expect(adapter.portOf(toPort(vcfIn))).toBeUndefined()
    })

    it("finds a port of a module added after the creation of the adapter", () => {
      const modules: LegacyModule[] = [ osc, amp ]
      const { adapter } = setup(IDLE_DRAG, [], undefined, () => modules)
      modules.push(vcf)
      expect(adapter.portOf(toPort(vcfIn))).toBe(vcfIn)
    })
  })

  describe("recolor", () => {
    it("recolors a saved cable in the store and saves it", async () => {
      const { adapter, cablesStore, effects } = setup(IDLE_DRAG, [ savedCable, otherCable ])
      await adapter.recolor(savedCable, "green")
      expect(cablesStore.get()).toEqual([ { ...savedCable, color: "green" }, otherCable ])
      expect(effects).toEqual([ { type: "cables.cable.save", id: cableId, color: "green" } ])
    })

    it("does not recolor a pending cable, and runs no effect", async () => {
      const { adapter, cablesStore, effects } = setup(IDLE_DRAG, [ pendingCable ])
      await adapter.recolor(pendingCable, "green")
      expect(cablesStore.get()).toEqual([ pendingCable ])
      expect(effects).toEqual([])
    })

    it("does nothing for an unknown connection", async () => {
      const { adapter, cablesStore, effects } = setup(IDLE_DRAG, [ otherCable ])
      await adapter.recolor(savedCable, "green")
      expect(cablesStore.get()).toEqual([ otherCable ])
      expect(effects).toEqual([])
    })

    it("writes the store before running the effects", async () => {
      const seen: string[] = []
      const { adapter, cablesStore } = setup(IDLE_DRAG, [ savedCable ], () => seen.push(cablesStore.get()[0]!.color))
      await adapter.recolor(savedCable, "yellow")
      expect(seen).toEqual([ "yellow" ])
    })

    it("does not change the drag state", async () => {
      const { adapter, dragStore } = setup(magnetized, [ savedCable ])
      await adapter.recolor(savedCable, "green")
      expect(adapter.drag()).toEqual(magnetized)
      expect(dragStore.history).toEqual([])
    })
  })
})
