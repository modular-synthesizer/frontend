import type { Uuid } from "../../../shared/data/Uuid.type"
import type { Placement } from "./Placement.type"

/**
 * A footprint represents what space is taken by a module in a synthesizer.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export type Footprint = {
  // The ID is given mostly so that a module footprint cannot be compared with itself.
  id: Uuid
  // Represents where the module is placed in the synthesizer
  placement: Placement
  // Represents the place the module is taking, the more, the wider it is.
  slots: number
}
