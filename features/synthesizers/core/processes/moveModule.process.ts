import type { SynthesizersEffect } from "../data/Effect.type";
import type { Footprint } from "../data/Footprint.type";
import type { Placement } from "../data/Placement.type";
import { hasRoom, placementsDiffer } from "../shared/rack";

export type MoveModuleFct = (from: Footprint, to: Placement, others: Footprint[]) =>
  { placement: Placement, effects: SynthesizersEffect[] }

/**
 * Produces a save module effect if the module can be placed at the new position in the given environment.
 *
 * @param from the module to place in the synthesizer.
 * @param to the position at which the module wants to check if it can be placed.
 * @param others the environment (list of other modules footprints) in which the module is checked.
 *
 * @return an object containing the new placement of the module, and the effects to run if there is any.
 */
export const moveModule: MoveModuleFct = (from, to, others) => {
  if (!hasRoom({ ...from, placement: to }, others)) return { placement: from.placement, effects: [] }
  if (!placementsDiffer(from.placement, to)) return { placement: from.placement, effects: [] }
  const effect: SynthesizersEffect = { type: "synthesizers.module.save", id: from.id, placement: to }
  return { placement: to, effects: [ effect ] }
}
