import type { ObjectId } from "../../../shared/data/ObjectId.type"
import type { HttpError, HttpRequest } from "../../../shared/http/http"
import { del } from "../../../shared/http/nuxt.http"
import { ok, type Result } from "../../../shared/results/result"

export type DeleteSynthesizerFct = (id: ObjectId) => Promise<Result<void, HttpError>>

export const makeDeleteSynthesizer = (del: HttpRequest): DeleteSynthesizerFct => async id =>
  (await del(`/proxy/synthesizers/${id}`, {})).flatMap(() => ok<void, HttpError>(undefined))

export const deleteSynthesizer = makeDeleteSynthesizer(del)
