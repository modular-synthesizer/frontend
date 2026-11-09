import { ok, type Result } from "../../../shared/results/result";
import type { Allocation } from "../data/Allocation.type";
import { toVoicesCount, type InvalidVoicesCount } from "../data/VoicesCount.type";

export type CreateAllocationFct = (voices: number) => Result<Allocation, InvalidVoicesCount>

export const createAllocation: CreateAllocationFct = voices =>
  toVoicesCount(voices).flatMap(v => ok({
    voices: Array.from({ length: v }, () => null), pressed: [], voicesCount: v
  }))
