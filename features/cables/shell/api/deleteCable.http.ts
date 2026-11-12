import type { ObjectId } from "../../../shared/data/ObjectId.type"
import type { HttpError, HttpRequest } from "../../../shared/http/http"
import { ok, type Result } from "../../../shared/results/result"

export type DeleteCableFct = (id: ObjectId) => Promise<Result<void, HttpError>>

export type DeleteCableFactory = (del: HttpRequest) => DeleteCableFct

export const deleteCable: DeleteCableFactory = del => async id =>
  (await del(`/proxy/links/${id}`, {}))
    .flatMap(() => ok<void, HttpError>(undefined))
