import type { Cable } from "../data/Cable.type"
import type { CablesEffect } from "../data/Effect.type"

export const unplugEffects = ({ origin, destination, id }: Cable): CablesEffect[] => {
  const disconnect: CablesEffect = { type: "cables.audio.disconnect", connection: { origin, destination } }
  return id === null ? [ disconnect ] : [ disconnect, { type: "cables.cable.delete", id } ]
}