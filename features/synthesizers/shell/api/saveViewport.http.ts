import { ok, type Result } from "../../../shared/results/result";
import type { Viewport } from "../../core/data/Synthesizer.type";
import type { Uuid } from "../../core/data/Uuid.type";
import type { HttpError, HttpPut } from "./http";

type SaveViewportClosure = (id: Uuid, viewport: Viewport) => Promise<Result<void, HttpError>>

type SaveViewportFct = (put: HttpPut) => SaveViewportClosure

export const saveViewport: SaveViewportFct = client => async (id, { position, scale }) => 
  client(`/proxy/synthesizers/${id}`, { x: position.x, y: position.y, scale })
    .then(response => response.flatMap(() => ok(undefined)))