import type { Synthesizer } from "~/types/Index";
import type { ViewPort } from "../../core/data/Synthesizer.type";
import { reset } from "../../core/processes/synthesizers/reset.process";
import { runEffect } from "../effect";
import { DEFAULT_VIEWPORT } from "../../core/shared/Constants";
import type { Uuid } from "../../core/data/Uuid.type";

export type ToViewPortFct = (s: Synthesizer) => ViewPort

export const toViewPort: ToViewPortFct = synthesizer => ({
  position: { x: synthesizer.x, y: synthesizer.y }, scale: synthesizer.scale
})

export type ApplyViewPortFct = (synthesizer: Synthesizer, viewPort: ViewPort) => void

export const applyViewPort: ApplyViewPortFct = (synthesizer, viewPort) => {
  synthesizer.x = viewPort.position.x
  synthesizer.y = viewPort.position.y
  synthesizer.scale = viewPort.scale
}

export type ResetSynthesizerFct = (s: Synthesizer) => Promise<void>

export const resetSynthesizer: ResetSynthesizerFct = async synth => {
  const viewPort = toViewPort(synth)
  const effectPromises = reset(synth.id as Uuid, viewPort).effects.map(runEffect)
  applyViewPort(synth, DEFAULT_VIEWPORT)
  await Promise.all(effectPromises)
}