import { ok, type Result } from "../../../shared/results/result";
import type { Uuid } from "../../../shared/data/Uuid.type";
import type { HttpError, HttpPut } from "../../../shared/http/http";

type SaveScaleClosure = (id: Uuid, scale: number) => Promise<Result<void, HttpError>>

type SaveScaleFct = (put: HttpPut) => SaveScaleClosure

export const saveScale: SaveScaleFct = client => async (id, scale) => 
  client(`/proxy/synthesizers/${id}`, { scale })
    .then(response => response.flatMap(() => ok(undefined)))