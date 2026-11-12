import type { Cable, Connection } from "../data/Cable.type";
import type { CablesFacts } from "../data/Facts.type";
import { sameConnection } from "../shared/connection";
import { unplugEffects } from "../shared/effects";

export type RemoveCableFct = (cables: readonly Cable[], target: Connection) => CablesFacts

export const removeCable: RemoveCableFct = (cables, target) => {
  const found = cables.find(cable => sameConnection(cable, target))
  if (found === undefined) return { cables: [ ...cables ], effects: [] }

  return {
    cables: cables.filter(cable => cable !== found),
    effects: unplugEffects(found),
  }
}