import type { Cable } from "../data/Cable.type";
import type { CableDrag } from "../data/CableDrag.type";
import type { DropFacts } from "../data/Facts.type";
import { accepts } from "../shared/connection";
import { DEFAULT_CABLE_COLOR, IDLE_DRAG } from "../shared/Constants";

export type DropCableFct = (drag: CableDrag, cables: readonly Cable[]) => DropFacts

export const dropCable: DropCableFct = (drag, cables) => {
  // If the user drops a non-magnetized (thus not audio connected) cable, it has no effect and renders the state idle.
  if (drag.step !== "magnetized") return { drag: IDLE_DRAG, cables: [ ...cables ], created: null, effects: [] }

  const { connection } = drag
  /**
   * Cables are synchronized between several users editing the same synthesizer, so a cable can be "in creation" by
   * user A, and created in the meaning by user B, following the steps :
   *   1. user A starts dragging a cable from port.a to port.b, and magnetizes it, NOT dropping it
   *   2. user B creates the same cable, or at least a cable using either port.a or port.b
   *   3. the cable is sent to user A through SSE, websockets or whatever
   *   4. yser A drops their cable, trying to create an impossible cable
   * This sequence should fail, and disconnect the illegal cable, rendering the state idle in the process.
   */
  if (!accepts(cables, connection.origin) || !accepts(cables, connection.destination)) {
    return {
      drag: IDLE_DRAG, cables: [ ...cables ], created: null,
      effects: [ { type: "cables.audio.disconnect", connection } ]
    }
  }

  // Successfully creates the cable, no need to connect it as the magnetization does the audio connection already.
  const created: Cable = { ...connection, id: null, color: DEFAULT_CABLE_COLOR }
  return { drag: IDLE_DRAG, cables: [ ...cables, created ], created, effects: [] }
}