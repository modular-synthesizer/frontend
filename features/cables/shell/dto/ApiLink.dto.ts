import { ko, ok, type Result } from "../../../shared/results/result"
import { toObjectId, type ObjectId } from "../../../shared/data/ObjectId.type"
import type { CableColor } from "../../core/data/Cable.type"
import { CABLE_COLORS, DEFAULT_CABLE_COLOR } from "../../core/shared/Constants"

export type ApiLink = { id: string, from: string, to: string, color: string }

export type IncomingLink = { id: ObjectId, from: ObjectId, to: ObjectId, color: CableColor }

export type InvalidLink = "link.invalid"

export type ParseLinkFct = (payload: unknown) => Result<IncomingLink, InvalidLink>

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value !== ""

const isApiLink = (payload: unknown): payload is Omit<ApiLink, "color"> & { color?: unknown } => {
  if (typeof payload !== "object" || payload === null) return false
  const { id, from, to } = payload as Partial<ApiLink>
  return isNonEmptyString(id) && isNonEmptyString(from) && isNonEmptyString(to)
}

const toColor = (color: unknown): CableColor =>
  CABLE_COLORS.find(c => c === color) ?? DEFAULT_CABLE_COLOR

export const parseLink: ParseLinkFct = payload => {
  if (!isApiLink(payload)) return ko<IncomingLink, InvalidLink>("link.invalid")
  return ok<IncomingLink, InvalidLink>({
    id: toObjectId(payload.id),
    from: toObjectId(payload.from),
    to: toObjectId(payload.to),
    color: toColor(payload.color),
  })
}