import { ok, type Result } from "../../../shared/results/result";
import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { HttpError, HttpRequest } from "../../../shared/http/http";
import type { Viewport } from "../../../viewports/core/data/Viewport.type";

type SaveViewportClosure = (id: ObjectId, viewport: Viewport) => Promise<Result<void, HttpError>>

type SaveViewportFct = (put: HttpRequest) => SaveViewportClosure

export const saveViewport: SaveViewportFct = client => async (id, { position, scale }) => 
  client(`/proxy/blueprints/${id}`, { x: position.x, y: position.y, scale })
    .then(response => response.flatMap(() => ok(undefined)))