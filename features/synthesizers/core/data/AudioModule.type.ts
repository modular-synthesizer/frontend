import type { Control } from "./Control.type"
import type { InnerLink } from "./InnerLink.type"
import type { InnerNodeTemplate } from "./InnerNode.type"
import type { Uuid } from "../../../shared/data/Uuid.type"

/**
 * An audio module is the virtual representation of a eurorack module. It belongs to a designated synthesizer, and can
 * interact with other modules of this synthesizer only. It can be linked to other modules via cables, and has several
 * controls modifying parameters in the nodes of its several polyphonic layers.
 */
export type AudioModule = {
  id: Uuid
  controls: InModule<Control>[]
  nodeTemplates: InModule<InnerNodeTemplate>[]
  linkTemplates: InModule<InnerLink>[]
}

export type InModule<T> = T & { audioModule: AudioModule }