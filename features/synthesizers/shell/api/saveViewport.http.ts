import { ok, type Result } from "../../../shared/results/result";
import type { Uuid } from "../../../shared/data/Uuid.type";
import type { HttpError, HttpPut } from "./http";
import type { Viewport } from "../../../viewports/core/data/Viewport.type";

type SaveViewportClosure = (id: Uuid, viewport: Viewport) => Promise<Result<void, HttpError>>

type SaveViewportFct = (put: HttpPut) => SaveViewportClosure

export const saveViewport: SaveViewportFct = client => async (id, { position, scale }) => 
  client(`/proxy/synthesizers/${id}`, { x: position.x, y: position.y, scale })
    .then(response => response.flatMap(() => ok(undefined)))