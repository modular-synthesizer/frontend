import type { Cable, CableColor, Connection } from "../data/Cable.type"
import type { CablesFacts } from "../data/Facts.type"
import { sameConnection } from "../shared/connection"

export type RecolorCableFct = (cables: readonly Cable[], target: Connection, color: CableColor) => CablesFacts

export const recolorCable: RecolorCableFct = (cables, target, color) => {
  const found = cables.find(cable => sameConnection(cable, target))
  if (!found || found.id === null || found.color === color) return { cables: [ ...cables ], effects: [] }

  return {
    cables: cables.map(cable => cable === found ? { ...cable, color } : cable),
    effects: [ { type: "cables.cable.save", id: found.id, color } ],
  }
}
