import type { InnerNodeTemplate } from "~/features/synthesizers/core/data/InnerNode.type"
import type { AudioModule } from "../../synthesizers/core/data/AudioModule.type"
import type { Uuid } from "../../synthesizers/core/data/Uuid.type"
import type { InnerLink } from "~/features/synthesizers/core/data/InnerLink.type"

type MockAudioModuleFct = (id?: string, nodes?: InnerNodeTemplate[], links?: InnerLink[]) => AudioModule

export const mockAudioModule: MockAudioModuleFct = (id = "moduleId", nodes = [], links = []) => {
  const audioModule: AudioModule = { id: id as Uuid, controls: [], nodeTemplates: [], linkTemplates: [] }
  
  audioModule.nodeTemplates = nodes.map(n => ({ audioModule, ...n }))
  audioModule.linkTemplates = links.map(l => ({ audioModule, ...l }))

  return audioModule
}