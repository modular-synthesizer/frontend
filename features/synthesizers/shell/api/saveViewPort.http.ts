import { ok, type Result } from "../../../shared/results/result";
import type { ViewPort } from "../../core/data/Synthesizer.type";
import type { HttpError, HttpPut } from "./http";

type SaveViewPortClosure = (id: string, viewPort: ViewPort) => Promise<Result<void, HttpError>>

type SaveViewPortFct = (put: HttpPut) => SaveViewPortClosure

export const saveViewPort: SaveViewPortFct = client => async (id, { position, scale }) => 
  client(`/proxy/synthesizers/${id}`, { x: position.x, y: position.y, scale })
    .then(response => response.flatMap(() => ok(undefined)))