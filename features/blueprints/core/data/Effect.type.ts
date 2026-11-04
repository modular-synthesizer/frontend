import type { Effect } from "../../../shared/facts";
import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { Viewport } from "../../../viewports/core/data/Viewport.type";
import type { Position } from "../../../viewports/core/data/Position.type";

export type BlueprintsEffect = Effect & (
  | { type: "blueprints.viewport.save", id: ObjectId, viewport: Viewport }
  | { type: "blueprints.node.save", blueprintId: ObjectId, id: ObjectId, position: Position }
)