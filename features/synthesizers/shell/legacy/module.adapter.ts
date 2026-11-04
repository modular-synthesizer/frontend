import type { AudioModule } from "~/types/Index";
import type { Placement } from "../../core/data/Placement.type";
import { hasRoom, toPlacement, toPosition, type Mapper } from "../../core/shared/rack";
import type { Footprint } from "../../core/data/Footprint.type";
import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { Position } from "../../../viewports/core/data/Position.type";
import type { RunEffectFct } from "../../../shared/facts";
import type { SynthesizersEffect } from "../../core/data/Effect.type";
import { moveModule } from "../../core/processes/moveModule.process";
import { runEffect } from "../effect";

export type toFootprintFct = (module: AudioModule, placement?: Placement) => Footprint

/**
 * Mapper of a module into a footprint, by eventually overwriting its position.
 * @param module the module to transform
 * @param placement if given, this will overwrite the module's position
 * @returns the footprint of the module, placed at the given position
 */
export const toFootprint: toFootprintFct = (module, placement) =>
  ({ id: module.id as ObjectId, placement: placement ?? { rack: module.rack, slot: module.slot }, slots: module.slots })

export type ApplyPlacementFct = (module: AudioModule, placement: Placement) => void

export const applyPlacement: ApplyPlacementFct = (module, { rack, slot }) => {
  module.rack = rack
  module.slot = slot
  const { x, y } = toPosition({ rack, slot })
  module.x = x
  module.y = y
}

/**
 * Maps a list of modules as a list of footprint that can be used to check for intersections.
 * @param modules the list of audio modules to take the footprints of
 * @returns the global footprint of the list of modules, as a list of footprints
 */
export const obstacles: Mapper<AudioModule[], Footprint[]> = modules =>
  modules.filter(module => !module.deleted).map(module => toFootprint(module))

export type SyncModuleFct = (module: AudioModule) => void

/**
 * Synchronizes the rack;slot coordinates of the module on its x;y position in the synthesizer
 * @param module the module to synchronize. It will apply its transformed placement.
 */
export const syncModule: SyncModuleFct = module =>
  applyPlacement(module, toPlacement(module))

export type AcceptsModuleFct = (module: AudioModule, at: Position, context: AudioModule[]) => boolean

/**
 * Checks if a context (set of modules) could accept a new module at a given position.
 * @param module The module to place, used to get the footprint by its slot.
 * @param at the position (x;y) to place the module at.
 * @param context the set of modules already placed, that could be obstacles for the one currently placed.
 * @returns TRUE if the module could be placed, FALSE otherwise.
 */
export const acceptsModuleAt: AcceptsModuleFct = (module, at, context) =>
  hasRoom(toFootprint(module, toPlacement(at)), obstacles(context))

export type MoveModuleFct = (module: AudioModule, from: Position, to: Position, context: AudioModule[]) => Promise<void>

export type MoveModuleFactory = (run: RunEffectFct<SynthesizersEffect>) => MoveModuleFct

export const makeMoveModule: MoveModuleFactory = run => async (module, from, to, context) => {
  const { placement, effects } = moveModule(toFootprint(module, toPlacement(from)), toPlacement(to), obstacles(context))
  applyPlacement(module, placement)
  await Promise.all(effects.map(run))
}

export const moveModuleAdapter = makeMoveModule(runEffect)