import type { AudioModule } from "../../data/AudioModule.type";
import type { Control } from "../../data/Control.type";
import type { InnerLink } from "../../data/InnerLink.type";
import type { InnerNodeTemplate } from "../../data/InnerNode.type";
import type { Uuid } from "../../data/Uuid.type";

type ModuleInitPayload = {
  id: Uuid,
  controls?: Control[]
  nodeTemplates?: InnerNodeTemplate[]
  linkTemplates?: InnerLink[]
}

export const initializeModule = ({ id, controls = [], nodeTemplates = [], linkTemplates = []}: ModuleInitPayload): AudioModule => {
  const audioModule: AudioModule = {
    id: id as Uuid,
    controls: [],
    layers: [],
    nodeTemplates: [],
    linkTemplates: []
  }

  audioModule.controls = controls.map(c => ({ ...c, audioModule }))
  audioModule.nodeTemplates = nodeTemplates.map(t => ({ ...t, audioModule }))
  audioModule.linkTemplates = linkTemplates.map(l => ({ ...l, audioModule }))

  return audioModule
}