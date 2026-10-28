import type { Synthesizer } from "~/types/Index";
import { reset } from "../../core/processes/synthesizers/reset.process";
import { runEffect, type RunEffectFct } from "../effect";
import type { Uuid } from "../../../shared/data/Uuid.type";
import { pan } from "../../core/processes/synthesizers/pan.process";
import type { Position } from "../../../viewports/core/data/Position.type";
import type { SynthesizersEffects } from "../../core/data/Effect.type";
import type { Viewport } from "../../../viewports/core/data/Viewport.type";

export type ViewportFacts = { viewport: Viewport, effects: SynthesizersEffects[] }

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

export type FactsApplier = (synth: Synthesizer, facts: ViewportFacts) => Promise<void>

export type FactsApplierFactory = (run: RunEffectFct) => FactsApplier

export const makeApplyFacts: FactsApplierFactory = run => async (synth, { viewport, effects }) => {
  applyViewport(synth, viewport)
  await Promise.all(effects.map(run))
}

export const applyFacts: FactsApplier = makeApplyFacts(runEffect)

export type ResetSynthesizerFct = (s: Synthesizer) => Promise<void>

export type ResetSynthesizerFactory = (apply: FactsApplier) => ResetSynthesizerFct

export const makeResetSynthesizer: ResetSynthesizerFactory = apply =>
  async synth => {
    const facts = reset(synth.id as Uuid, toViewport(synth))
    await apply(synth, facts)
  }

export const resetSynthesizer = makeResetSynthesizer(applyFacts)

export type PanSynthesizerFct = (s: Synthesizer, from: Position, to: Position) => Promise<void>

export type PanSynthesizerFactory = (apply: FactsApplier) => PanSynthesizerFct

export const makePanSynthesizer: PanSynthesizerFactory = apply =>
  async (synth, from, to) => {
    const facts = pan(synth.id as Uuid, { ...toViewport(synth), position: from }, to)
    await apply(synth, facts)
  }

export const panSynthesizer = makePanSynthesizer(applyFacts)
