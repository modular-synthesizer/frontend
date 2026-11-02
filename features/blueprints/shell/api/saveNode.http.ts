import { ok, type Result } from "../../../shared/results/result";
import type { Uuid } from "../../../shared/data/Uuid.type";
import type { HttpError, HttpPut } from "../../../shared/http/http";
import type { Position } from "../../../viewports/core/data/Position.type";

type SaveNodeClosure = (blueprintId: Uuid, id: Uuid, position: Position) => Promise<Result<void, HttpError>>

type SaveNodeFct = (put: HttpPut) => SaveNodeClosure

export const saveNode: SaveNodeFct = client => async (blueprintId, id, position) => 
  client(`/proxy/blueprints/nodes/${id}`, { blueprint_id: blueprintId, x: position.x, y: position.y })
    .then(response => response.flatMap(() => ok(undefined)))