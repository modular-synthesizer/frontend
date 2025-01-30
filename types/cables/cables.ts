import type { Coordinates } from "../utils/Coordinates"
import type { Identified } from "../utils/Identified"

export type Cable = Identified & {
  from: Coordinates,
  to: Coordinates,
}