import type { Synthesizer } from "~/types/Index";
import type { Viewport } from "../../core/data/Synthesizer.type";
import { reset } from "../../core/processes/synthesizers/reset.process";
import { runEffect } from "../effect";
import { DEFAULT_VIEWPORT } from "../../core/shared/Constants";
import type { Uuid } from "../../core/data/Uuid.type";

export type ToViewportFct = (s: Synthesizer) => Viewport

export const toViewport: ToViewportFct = synthesizer => ({
  position: { x: synthesizer.x, y: synthesizer.y }, scale: synthesizer.scale
})

export type ApplyViewportFct = (synthesizer: Synthesizer, viewport: Viewport) => void

export const applyViewport: ApplyViewportFct = (synthesizer, viewport) => {
  synthesizer.x = viewport.position.x
  synthesizer.y = viewport.position.y
  synthesizer.scale = viewport.scale
}

export type ResetSynthesizerFct = (s: Synthesizer) => Promise<void>

export const resetSynthesizer: ResetSynthesizerFct = async synth => {
  const viewport = toViewport(synth)
  const effectPromises = reset(synth.id as Uuid, viewport).effects.map(runEffect)
  applyViewport(synth, DEFAULT_VIEWPORT)
  await Promise.all(effectPromises)
}