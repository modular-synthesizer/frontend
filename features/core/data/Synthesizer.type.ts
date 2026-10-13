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
  /** Modules are the basic building brick of the synthesizer. */
  audioModules: InSynthesizer<AudioModule>[]
  /** The different cables linking modules with one another. */
  cables: InSynthesizer<Cable>[]
  /** The position determines where the module set in its entirety will be represented on screen. */
  position: Position
  /** The scale is the zoom level, 1 is not zoom, < 1 is zommed out, > 1 is zoomed in. */
  scale: number
  /** The name of the synthesizer, supposed to be uniq for the user */
  name: string
  /** The representation of the different memberships for users in this synthesizer. */
  memberships: InSynthesizer<Membership>[]
  /** The uniq identifier for this synthesizer, used for queries. */
  id: Uuid
}

export type InSynthesizer<T> = T & { synthesizer: Synthesizer }

/**
 * A polyphony voice is a "layer" in the synthesizer, with each and every inner node of each and every audio
 * modules instanciated and linked between them. It then proceeds to generate and modify the signal along the
 * way with different inputs (usually MIDI messages).
 * 
 * A voice should be able to be added or removed to a synthesizer dynamically, whenever a user plays or stops
 * playing a note. Destroyed polyphony voices should have their nodes correctly unplugged.
 */
export type PolyphonyVoice = {
  /** The audio nodes for this polyphony voice, treating and transforming the signal. */
  nodes: {[key: string]: AudioNode}
}

export type InVoice<T> = T & { voice: PolyphonyVoice }