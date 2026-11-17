import type { Port as LegacyPort } from "~/types/modules/Port"
import type { AudioModule as LegacyAudioModule } from "~/types/modules/AudioModule"
import type { Coordinates } from "~/types/utils/Coordinates"
import type { Port } from "../../core/data/Port.type"
import type { Mapper } from "../../../shared/types/mapper.type"
import { makeCableAudio, type NodesResolver } from "../audio/cable.audio"
import { toObjectId, type ObjectId } from "../../../shared/data/ObjectId.type"
import type { CableDrag } from "../../core/data/CableDrag.type"
import type { Cable, CableColor, Connection, SavedCable } from "../../core/data/Cable.type"
import { createCable, type CreateCableFct } from "../api/createCable.http"
import type { RunEffectFct } from "../../../shared/facts"
import type { CablesEffect } from "../../core/data/Effect.type"
import type { Control as LegacyControl } from "~/types/Index"
import { makeRunEffect } from "../effect"
import { del, put } from "../../../shared/http/nuxt.http"
import { startCable } from "../../core/processes/startCable.process"
import { magnetizeCable } from "../../core/processes/magnetizeCable.process"
import { cancelCable } from "../../core/processes/cancelCable.process"
import { dropCable } from "../../core/processes/dropCable.process"
import { removeCable } from "../../core/processes/removeCable.process"
import { unplugModule } from "../../core/processes/unplugModule.process"
import { unmagnetizeCable } from "../../core/processes/unmagnetizeCable.process"
import { receiveCable } from "../../core/processes/receiveCable.process"
import { parseLink } from "../dto/ApiLink.dto"
import { orient } from "../../core/shared/connection"
import { confirmCable } from "../../core/processes/confirmCable.process"
import { recolorCable } from "../../core/processes/recolorCable.process"

export type Store<T> = { get: () => T, set: (value: T) => void }

export const toPort: Mapper<LegacyPort, Port> = legacy => ({
  id: toObjectId(legacy.id),
  moduleId: toObjectId(legacy.mod.id),
  kind: legacy.kind,
  node: legacy.target,
  index: legacy.index
})

export const portPosition: Mapper<LegacyPort, Coordinates> = legacy => {
  const control: LegacyControl | undefined = legacy.mod.controls.find(v => {
    return v.component === "Port" && v.payload?.target === legacy.name
  })
  if (!control) return { x: legacy.mod.x, y: legacy.mod.y }
  return {
    x: +(control.payload.x ?? 0) + legacy.mod.x,
    y: +(control.payload.y ?? 0) + legacy.mod.y
  }
}

export type ResolveNodesFct = (modules: () => readonly LegacyAudioModule[]) => NodesResolver

export const resolveNodes: ResolveNodesFct = modules => id => {
  const found: LegacyAudioModule | undefined = modules().find(m => m.id === id)
  return found ? found.channels.map(c => c.nodes) : []
}

export const refStore: <T>(source: Ref<T>) => Store<T> = source => {
  return { get: () => source.value, set: v => (source.value = v) }
}

export type CablesContext = {
  synthesizerId: ObjectId
  modules: () => readonly LegacyAudioModule[]
  cables: Store<Cable[]>
  drag: Store<CableDrag>
  create: CreateCableFct
  run: RunEffectFct<CablesEffect>
}

export type CablesAdapter = {
  drag: () => CableDrag
  start: (port: LegacyPort) => Promise<void>
  magnetize: (port: LegacyPort) => Promise<void>
  unmagnetize: (port: LegacyPort) => Promise<void>
  cancel: () => Promise<void>
  drop: () => Promise<void>
  remove: (cable: Connection) => Promise<void>
  unplugModule: (module: LegacyAudioModule) => Promise<void>
  receiveAdded: (payload: unknown) => Promise<void>
  load: (payloads: readonly unknown[]) => Promise<void>
  portOf: (port: Port) => LegacyPort | undefined
  recolor: (cable: Cable, color: CableColor) => Promise<void>
}

const createCommit: (run: RunEffectFct<CablesEffect>) => (effects: CablesEffect[]) => Promise<void> = run => async effects => {
  for(const effect of effects) await run(effect)
}

export type CablesFactory = (context: CablesContext) => CablesAdapter

export const makeCables: CablesFactory = context => {
  const commit = createCommit(context.run)
  const adapter: CablesAdapter = {
    drag: () => context.drag.get(),
    start: async port => {
      const facts = startCable(context.drag.get(), toPort(port), context.cables.get())
      context.drag.set(facts.drag)
      await commit(facts.effects)
    },
    magnetize: async port => {
      const facts = magnetizeCable(context.drag.get(), toPort(port), context.cables.get())
      context.drag.set(facts.drag)
      await commit(facts.effects)
    },
    unmagnetize: async port => {
      const facts = unmagnetizeCable(context.drag.get(), toPort(port))
      context.drag.set(facts.drag)
      await commit(facts.effects)
    },
    cancel: async () => {
      const facts = cancelCable(context.drag.get())
      context.drag.set(facts.drag)
      await commit(facts.effects)
    },
    drop: async () => {
      const facts = dropCable(context.drag.get(), context.cables.get())
      context.cables.set(facts.cables)
      context.drag.set(facts.drag)
      await commit(facts.effects)

      if(!facts.created) return

      const response = await context.create(context.synthesizerId, facts.created)
      const connection: Connection = { origin: facts.created.origin, destination: facts.created.destination}
      const confirmed = confirmCable(context.cables.get(), connection, response)
      context.cables.set(confirmed.cables)
      await commit(confirmed.effects)
    },
    remove: async cable => {
      const facts = removeCable(context.cables.get(), cable)
      context.cables.set(facts.cables)
      await commit(facts.effects)
    },
    unplugModule: async module => {
      const facts = unplugModule(context.cables.get(), toObjectId(module.id))
      context.cables.set(facts.cables)
      await commit(facts.effects)
    },
    receiveAdded: async payload => {
      const linkResult = parseLink(payload)
      if (!linkResult.ok) return
      
      const link = linkResult.orNull()
      const ports = context.modules().flatMap(m => m.ports)
      const output = ports.find(p => p.id === link.from)
      const input = ports.find(p => p.id === link.to)

      if (!input || !output) return

      const orientedResult = orient(toPort(output), toPort(input))

      if (!orientedResult.ok) return

      const cable: SavedCable = { ... orientedResult.orNull(), color: link.color, id: link.id }
      const facts = receiveCable(context.cables.get(), cable)
      context.cables.set(facts.cables)
      await commit(facts.effects)
    },
    load: async payload => {
      for (const candidate of payload) await adapter.receiveAdded(candidate)
    },
    portOf: port =>
      context.modules()
        .flatMap(m => m.ports)
        .find(p => p.id === port.id),
    recolor: async (cable, color) => {
      const connection: Connection = { origin: cable.origin, destination: cable.destination }
      const facts = recolorCable(context.cables.get(), connection, color)
      context.cables.set(facts.cables)
      await commit(facts.effects)
    }
  }
  return adapter
}

export type CreateCablesFct = (
  synthesizerId: ObjectId,
  modules: () => readonly LegacyAudioModule[],
  cables: Ref<Cable[]>,
  drag: Ref<CableDrag>
) => CablesAdapter
export const createCables: CreateCablesFct = (synthesizerId, modules, cables, drag) => makeCables({
  synthesizerId: synthesizerId,
  modules,
  cables: refStore(cables),
  drag: refStore(drag),
  create: createCable,
  run: makeRunEffect({ del, put, audio: makeCableAudio(resolveNodes(modules)) })
})