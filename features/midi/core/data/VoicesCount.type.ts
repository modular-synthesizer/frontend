import { ko, ok, type Result } from "../../../shared/results/result"
import type { Mapper } from "../../../shared/types/mapper.type"

export type VoicesCount = number & { _brand: "VoicesCount" }

export type InvalidVoicesCount = "voices.count.invalid"

export const toVoicesCount: Mapper<number, Result<VoicesCount, InvalidVoicesCount>> = raw =>
  (Number.isInteger(raw) && raw >= 1) ? ok(raw as VoicesCount) : ko("voices.count.invalid")