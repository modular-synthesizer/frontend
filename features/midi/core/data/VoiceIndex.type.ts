import { ko, ok, type Result } from "../../../shared/results/result"
import type { VoicesCount } from "./VoicesCount.type"

export type VoiceIndex = number & { _brand: "VoiceIndex" }

export type InvalidVoiceIndex = "voice.index.invalid"

export type ToVoiceIndexFct = (raw: number, max: VoicesCount) => Result<VoiceIndex, InvalidVoiceIndex>

export const toVoiceIndex: ToVoiceIndexFct = (raw, max) =>
  (Number.isInteger(raw) && raw >= 0 && raw < max) ? ok(raw as VoiceIndex) : ko("voice.index.invalid")