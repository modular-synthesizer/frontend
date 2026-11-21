import type { Result } from "../../../shared/results/result"
import { parseSynthesizers, type ApiSynthesizer } from "../dto/ApiSynthesizer.dto"
import type { HttpError, HttpRequest } from "../../../shared/http/http"
import { get } from "../../../shared/http/nuxt.http"

export type ListSynthesizersFct = () => Promise<Result<ApiSynthesizer[], HttpError>>

export const makeListSynthesizers = (get: HttpRequest): ListSynthesizersFct => async () =>
  (await get("/proxy/synthesizers", {})).flatMap(parseSynthesizers)

export const listSynthesizers = makeListSynthesizers(get)