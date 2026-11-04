import { toObjectId } from "../../../shared/data/ObjectId.type";
import type { Position } from "../../../viewports/core/data/Position.type"
import type { Footprint } from "../data/Footprint.type";
import type { Placement } from "../data/Placement.type";
import { RACK_HEIGHT, SLOT_SIZE } from "./Constants"

export type Mapper<F, T> = (from: F) => T

/**
 * Mapper transforming a position (coordinates) in a placement (place in a synthesizer).
 * @param from the original position to transform as a x;y couple.
 * @returns the transformed placement, as a rack;slot couple.
 */
export const toPlacement: Mapper<Position, Placement> = ({ x, y }) =>
  ({ slot: Math.round(x / SLOT_SIZE), rack: Math.round(y / RACK_HEIGHT) })

/**
 * Mapper transforming a placement (place in a synthesizer) in a position (coordinates).
 * @param from the original placement to transform as a rack;slot couple.
 * @returns the transformed position, as a x;y couple.
 */
export const toPosition: Mapper<Placement, Position> = ({ slot, rack }) =>
  ({ x: slot * SLOT_SIZE, y: rack * RACK_HEIGHT })

export type Diff<T> = (first: T, second: T) => boolean

/**
 * Checks that two placements differ (not the same place in the synthesizer).
 * @returns TRUE if both placements are not the same, FALSE if they are.
 */
export const placementsDiffer: Diff<Placement> = (first, second) =>
  (first.rack !== second.rack || first.slot !== second.slot)

export type OverlapFct = (first: Footprint, second: Footprint) => boolean

/**
 * Checks that two given modules positions overlap (both cannot be placed in the same synthesizer)
 * @returns TRUE if both modules overlap, FALSE otherwise.
 */
export const overlaps: OverlapFct = (first, second) =>
  first.id !== second.id
    && first.placement.rack === second.placement.rack
    && first.placement.slot < second.placement.slot + second.slots
    && second.placement.slot < first.placement.slot + first.slots

export type HasRoomFct = (module: Footprint, modules: Footprint[]) => boolean

/**
 * Check that a module can be placed in a synthesizer, represented by its already existing modules placements.
 * @param module the module to place in the synthesizer.
 * @param modules the list of modules already existing in the synthesizer.
 * @returns TRUE if the new module can be placed in the synthesizer, FALSE otherwise.
 */
export const hasRoom: HasRoomFct = (module, modules) =>
  !modules.some(other => overlaps(module, other))


export function firstFreeSlot(obstacles: Footprint[], slots: number) {
  let slot = 0;
  while(!hasRoom({ placement: { rack: 0, slot }, slots, id: toObjectId("") }, obstacles)) slot ++;
  return slot;
}