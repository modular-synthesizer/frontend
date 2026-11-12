import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { Cable, Connection } from "../data/Cable.type";
import type { CablesFacts } from "../data/Facts.type";

export type ReceiveRemovalFct = (cables: readonly Cable[], id: ObjectId) => CablesFacts

export const receiveRemoval: ReceiveRemovalFct = (cables, id) => {
  const found: Cable | undefined = cables.find(c => c.id === id)
  if (found) {
    const connection: Connection = { origin: found.origin, destination: found.destination }
    return {
      cables: cables.filter(c => c.id !== id),
      effects: [ { type: "cables.audio.disconnect", connection } ]
    }
  }
  return { cables: [ ...cables ], effects: [] }
}