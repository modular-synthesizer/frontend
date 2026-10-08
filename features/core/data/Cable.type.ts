import type { Port } from "./Control.type"
import type { Synthesizer } from "./Synthesizer.type"
import type { Uuid } from "./Uuid.type"

/**
 * A cable is a polyphonic or monophonic connection between two audio modules. A cable holds several
 * connections from a port to another port, ie from a WAA AudioNode to another WAA Audio Node, each
 * origin and destination nodes being in separate polyphonic layers of the module.
 */
export type Cable = {
  synthesizer: Synthesizer
  /** The unique identifier used to delete or edit the cable */
  id: Uuid
  /** The output port of the module producing the signal transmitted in the cable. */
  origin: Port
  /** The input port in which goes the transmitted signal */
  destination: Port
}