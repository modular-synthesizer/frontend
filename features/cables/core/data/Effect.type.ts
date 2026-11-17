import type { Effect } from "../../../shared/facts";
import type { CableColor, Connection } from "./Cable.type";
import type { ObjectId } from "../../../shared/data/ObjectId.type";

export type CablesEffect = Effect & (
  /** Web Audio API connection of the given cable, as a connection between two nodes */
  | { type: "cables.audio.connect", connection: Connection }
  /** Web Audio API disconnection of the given cable, as a connection between two nodes */
  | { type: "cables.audio.disconnect", connection: Connection }
  /** API Deletion of a cable */
  | { type: "cables.cable.delete", id: ObjectId }
  /** API update for the color of a cable */
  | { type: "cables.cable.save", id: ObjectId, color: CableColor }
)