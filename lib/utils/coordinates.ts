import type { Coordinates } from "~/types/utils/Coordinates";
import { RACK_HEIGHT, SLOT_SIZE } from "~~/lib/utils/constants";

/**
 * Gets the position of the cursor inside the current synthesizer's racks.
 * @param $event The MouseEvent used as absolute position of the cursor
 *   on the whole page.
 * @return An {x,y} object representing the coordinates in the synth.
 */
export function relativePosition(ax: number, ay: number): Coordinates {
  const synth = useSynthesizer().synthesizer.value;
  if (synth === null) return { x: 0, y: 0 };
  return {
    x: (ax - synth.x) / synth.scale,
    y: (ay - synth.y) / synth.scale
  };
}

/**
 * Given the position of the cursor in a synthesizer, it provides the rack
 * wrapper object corresponding to it.
 * 
 * @param position The relative position of the cursor in the synth.
 * @returns the rack wrapper object corresponding to the rack into which the
 *   cursor currently is.
 */
export function getRack(x: number, y: number): number {
  const position: Coordinates = relativePosition(x, y);
  return Math.floor(position.y/ RACK_HEIGHT);
}

/**
 * Given the position of the cursor in the synthesizer, it returns the slot
 * object the cursor is supposed to be hovering, even when  this slot is
 * hidden behind a node.
 * 
 * @param position The relative position of the cursor in the synth.
 * @returns The slot object in the rack the cursor currently is. The
 *   slot is not only an index, but the whole object, making it possible
 *   to directly access the rack property.
 */
export function getSlot(x: number, y: number): number {
  const position: Coordinates = relativePosition(x, y);
  return Math.floor(position.x / SLOT_SIZE);
}