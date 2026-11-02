import type { Effect } from "../../../shared/facts";
import type { Uuid } from "../../../shared/data/Uuid.type";
import type { Viewport } from "../../../viewports/core/data/Viewport.type";
import type { Position } from "../../../viewports/core/data/Position.type";

export type BlueprintsEffect = Effect & (
  | { type: "blueprints.viewport.save", id: Uuid, viewport: Viewport }
  | { type: "blueprints.node.save", blueprintId: Uuid, id: Uuid, position: Position }
)