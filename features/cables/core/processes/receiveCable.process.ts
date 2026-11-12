import type { Cable, SavedCable } from "../data/Cable.type"
import type { CablesFacts } from "../data/Facts.type"
import { isPending, sameConnection } from "../shared/connection"

export type ReceiveCableFct = (cables: readonly Cable[], incoming: SavedCable) => CablesFacts

export const receiveCable: ReceiveCableFct = (cables, incoming) => {
  /** The cable is already in the list, so we just return a copy of it, no edition. */
  if (cables.some(cable => cable.id === incoming.id)) return { cables: [ ...cables ], effects: [] }

  /** The cable is found as pending, so we give it an ID, and return the list with the identified cable in it. */
  if (cables.some(cable => isPending(cable, incoming))) return {
    cables: cables.map(cable => isPending(cable, incoming) ? { ...cable, id: incoming.id } : cable),
    effects: []
  }

  /** If the cable already exists with another ID, we don't double the connection. */
  if (cables.some(cable => sameConnection(cable, incoming))) return { cables: [ ...cables ], effects: [] }

  /** Last case is for the cable not found at all in the list : we simply add it. */
  return {
    cables: [ ...cables, incoming ],
    effects: [ { type: "cables.audio.connect", connection: { origin: incoming.origin, destination: incoming.destination } } ]
  }
}
