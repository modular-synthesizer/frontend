import { positionsDiffer } from "../../../viewports/core/shared/viewport";
import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { Position } from "../../../viewports/core/data/Position.type";
import type { BlueprintsEffect } from "../data/Effect.type";

export type MoveNodeFct = (blueprintId: ObjectId | null, id: ObjectId, from: Position, to: Position) =>
  { position: Position, effects: BlueprintsEffect[] }

export const moveNode: MoveNodeFct = (blueprintId, id, from, to) => {
  if (blueprintId === null || !positionsDiffer(from, to)) return { position: to, effects: [] }
  return { position: to, effects: [ { type: "blueprints.node.save", id, blueprintId, position: to } ]}
}