import type { AudioModule } from "./AudioModule.type"
import type { Cable } from "./Cable.type"
import type { Membership } from "./Membership.type"
import type { Position } from "./Position.type"
import type { Uuid } from "./Uuid.type"

/**
 * A synthesizer holds several displayed audio modules that can be interacted with, and placed by the user,
 * and a set of cables that link said modules. The permissions are managed by the memberships and their current
 * status indicating if the user can interact with the modules and cables.
 */
export type Synthesizer = {
  audioModules: AudioModule[]
  cables: Cable[]
  /** The position determines where the module set in its entirety will be represented on screen. */
  position: Position
  /** The scale is the zoom level, 1 is not zoom, < 1 is zommed out, > 1 is zoomed in. */
  scale: number
  name: string
  memberships: Membership[]
  id: Uuid
}