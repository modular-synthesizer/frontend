import { ok, type Result } from "../../../shared/results/result";
import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { HttpError, HttpPut } from "../../../shared/http/http";
import type { Position } from "../../../viewports/core/data/Position.type";

type SaveNodeClosure = (blueprintId: ObjectId, id: ObjectId, position: Position) => Promise<Result<void, HttpError>>

type SaveNodeFct = (put: HttpPut) => SaveNodeClosure

export const saveNode: SaveNodeFct = client => async (blueprintId, id, position) => 
  client(`/proxy/blueprints/nodes/${id}`, { blueprint_id: blueprintId, x: position.x, y: position.y })
    .then(response => response.flatMap(() => ok(undefined)))