import type { ObjectId } from "../../../shared/data/ObjectId.type"
import type { HttpError, HttpRequest } from "../../../shared/http/http"
import { ko, ok, type Result } from "../../../shared/results/result"
import type { Cable } from "../../core/data/Cable.type"
import { parseLink } from "../dto/ApiLink.dto"
import { post } from "../../../shared/http/nuxt.http"

export const INVALID_LINK: HttpError = { status: 500, key: "unknown", message: "unknown" }

export type CreateCableFct = (synthesizerId: ObjectId, cable: Cable) => Promise<Result<ObjectId, HttpError>>

export type CreateCableFactory = (post: HttpRequest) => CreateCableFct

const toId = (payload: unknown): Result<ObjectId, HttpError> => {
  const link = parseLink(payload).orNull()
  return link === null ? ko<ObjectId, HttpError>(INVALID_LINK) : ok<ObjectId, HttpError>(link.id)
}

export const makeCreateCable: CreateCableFactory = post => async (synthesizerId, cable) => {
  const payload = {
    synthesizer_id: synthesizerId,
    from: cable.origin.id,
    to: cable.destination.id,
    color: cable.color,
  }
  return (await post("/proxy/links", payload))
    .flatMap(toId)
}
export const createCable: CreateCableFct = makeCreateCable(post)