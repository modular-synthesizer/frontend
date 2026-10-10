import type { AudioModule } from "../../data/AudioModule.type";
import type { Uuid } from "../../data/Uuid.type";

export const initializeModule = (id: Uuid): AudioModule => ({
  id: id as Uuid,
  controls: [],
  layers: [],
  nodeTemplates: [],
  linkTemplates: []
})