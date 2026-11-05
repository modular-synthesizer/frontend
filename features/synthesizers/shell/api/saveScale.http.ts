import { ok, type Result } from "../../../shared/results/result";
import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { HttpError, HttpRequest } from "../../../shared/http/http";

type SaveScaleClosure = (id: ObjectId, scale: number) => Promise<Result<void, HttpError>>

type SaveScaleFct = (put: HttpRequest) => SaveScaleClosure

export const saveScale: SaveScaleFct = client => async (id, scale) => 
  client(`/proxy/synthesizers/${id}`, { scale })
    .then(response => response.flatMap(() => ok(undefined)))