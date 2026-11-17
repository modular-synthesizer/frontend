import type { ObjectId } from "../../../shared/data/ObjectId.type"
import type { CableColor } from "../../core/data/Cable.type"
import { ok, type Result } from "../../../shared/results/result"
import type { HttpError, HttpRequest } from "../../../shared/http/http"

export type SaveCableFct = (id: ObjectId, color: CableColor) => Promise<Result<void, HttpError>>

export type SaveCableFactory = (put: HttpRequest) => SaveCableFct

export const saveCable: SaveCableFactory = put => async (id, color) =>
  (await put(`/proxy/links/${id}`, { color }))
    .flatMap(() => ok<void, HttpError>(undefined))
