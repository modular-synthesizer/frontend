import type { Control } from "./Control.type"
import type { InnerLink } from "./InnerLink.type"
import type { InnerNode, InnerNodeTemplate } from "./InnerNode.type"
import type { Uuid } from "./Uuid.type"

/**
 * An audio module is the virtual representation of a eurorack module. It belongs to a designated synthesizer, and can
 * interact with other modules of this synthesizer only. It can be linked to other modules via cables, and has several
 * controls modifying parameters in the nodes of its several polyphonic layers.
 */
export type AudioModule = {
  id: Uuid
  controls: InModule<Control>[]
  layers: InModule<PolyphonyLayer>[]
  nodeTemplates: InModule<InnerNodeTemplate>[]
  linkTemplates: InModule<InnerLink>[]
}

export type InModule<T> = T & { audioModule: AudioModule }

/**
 * A polyphonic layer is the internal structure of the audio node of a polyphonic layer. A layer holds all the audio
 * nodes and the connections between them to manage the audio signal. The nodes are created from inner node templates
 * and connected from inner link templates.
 */
export type PolyphonyLayer = {
  innerNodes: InLayer<InnerNode>[]
}

export type InLayer<T> = T & { layer: PolyphonyLayer }