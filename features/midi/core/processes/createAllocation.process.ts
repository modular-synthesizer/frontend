import { ok, type Result } from "../../../shared/results/result";
import type { Allocation } from "../data/Allocation.type";
import { toVoicesCount, type InvalidVoicesCount } from "../data/VoicesCount.type";

export type CreateAllocationFct = (voices: number) => Result<Allocation, InvalidVoicesCount>

/**
 * Factory to create a new allocation object for the polyphony voices of a module.
 * 
 * @param voices a number of voices ton instanciate in the allocation
 * 
 * @returns an allocation object containing the voices, the pressed keys and the number
 *   of polyphony voices.
 */
export const createAllocation: CreateAllocationFct = voices =>
  toVoicesCount(voices).flatMap(v => ok({
    voices: Array.from({ length: v }, () => null), pressed: [], voicesCount: v
  }))
