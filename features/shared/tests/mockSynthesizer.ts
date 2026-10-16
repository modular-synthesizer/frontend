import type { AudioModule } from "../../synthesizers/core/data/AudioModule.type"
import type { Synthesizer } from "../../synthesizers/core/data/Synthesizer.type"
import type { Uuid } from "../../synthesizers/core/data/Uuid.type"

export type MockSynthesizerFct = (name?: string, audioModules?: AudioModule[]) => Synthesizer

export const mockSynthesizer: MockSynthesizerFct = (name = "synth name", modules = []) => {
  const synthesizer: Synthesizer = { name, id: "synth.id" as Uuid, audioModules: [], cables: [], memberships: [], position: { x: 0, y: 0 }, scale: 1.0 }
  synthesizer.audioModules = modules.map(m => ({ ...m, synthesizer }))
  return synthesizer
}