import type { ObjectId } from "../../../shared/data/ObjectId.type"
import { ok, type Result } from "../../../shared/results/result"
import type { Cable, Connection } from "../data/Cable.type"
import type { CablesFacts } from "../data/Facts.type"
import { isPending } from "../shared/connection"

export type ConfirmCableFct = (cables: readonly Cable[], created: Connection, response: Result<ObjectId, unknown>) => CablesFacts

const identify = (cables: readonly Cable[], created: Connection, id: ObjectId): CablesFacts => {
  // The notification arrived before the response and already identified the cable
  if (cables.some(cable => cable.id === id)) return { cables: [ ...cables ], effects: [] }
  // The cable was removed during the request: it must be deleted on the server too
  if (!cables.some(cable => isPending(cable, created))) {
    return { cables: [ ...cables ], effects: [ { type: "cables.cable.delete", id } ] }
  }
  return {
    cables: cables.map(cable => isPending(cable, created) ? { ...cable, id } : cable),
    effects: []
  }
}

const discard = (cables: readonly Cable[], created: Connection): CablesFacts => {
  if (!cables.some(cable => isPending(cable, created))) return { cables: [ ...cables ], effects: [] }
  return {
    cables: cables.filter(cable => !isPending(cable, created)),
    effects: [ { type: "cables.audio.disconnect", connection: created } ]
  }
}

export const confirmCable: ConfirmCableFct = (cables, created, response) =>
  response
    .flatMap((id: ObjectId) => ok(identify(cables, created, id)))
    .or(discard(cables, created))
