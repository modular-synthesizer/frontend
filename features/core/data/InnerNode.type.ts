import type { PolyphonyLayer } from "./AudioModule.type"
import type { Uuid } from "./Uuid.type"

/**
 * A node template is a template to create wrapped audio nodes in a layer in the corresponding
 * audio module. The created nodes are then linked to other nodes using inner links templates
 * to determine the path of the signal in the nodes infrastructure.
 */
export type InnerNodeTemplate = {
  /** A unique identifier used by controls to know on which node they must act */
  id: Uuid
  /** The name to be given to audio nodes created with this template. */
  name: string
  /** The function generating a Web Audio API AudioNode object to be able to work with audio signals. */
  generator: () => Promise<AudioNode>
}

/**
 * An instanciated node, holding the representation of the web audio API node producing or
 * treating the signal. It will then be linked to other nodes to make the full path of the signal.
 */
export type InnerNode = {
  /** The identifier of the inner node template reproduced in every layer to search for nodes */
  id: Uuid
  /** The name of the inner node identifying it. */
  name: string
  /** The Web Audio API AudioNode created in this inner node, handling or generating the signal. */
  audioNode: AudioNode
}