import { makeApplyFacts, toViewport, type FactsApplier } from "../../../viewports/shell/legacy/viewport.adapter"
import type { Synthesizer } from "~/types/Index"
import { reset } from "../../core/processes/reset.process"
import type { Uuid } from "../../../shared/data/Uuid.type"
import type { Position } from "../../../viewports/core/data/Position.type"
import { pan } from "../../core/processes/pan.process"
import { runEffect } from "../effect"
import type { SynthesizersEffect } from "../../core/data/Effect.type"
import { zoom } from "../../core/processes/zoom.process"
import { makeDebounce, timeoutScheduler } from "../../../shared/effects/debounce"

export const applyFacts: FactsApplier<SynthesizersEffect> = makeApplyFacts(runEffect)

export type ResetSynthesizerFct = (s: Synthesizer) => Promise<void>

export type ResetSynthesizerFactory = (apply: FactsApplier<SynthesizersEffect>) => ResetSynthesizerFct

export const makeResetSynthesizer: ResetSynthesizerFactory = apply =>
  async synth => {
    const facts = reset(synth.id as Uuid, toViewport(synth))
    await apply(synth, facts)
  }

export const resetSynthesizer = makeResetSynthesizer(applyFacts)

export type PanSynthesizerFct = (s: Synthesizer, from: Position, to: Position) => Promise<void>

export type PanSynthesizerFactory = (apply: FactsApplier<SynthesizersEffect>) => PanSynthesizerFct

export const makePanSynthesizer: PanSynthesizerFactory = apply =>
  async (synth, from, to) => {
    const facts = pan(synth.id as Uuid, { ...toViewport(synth), position: from }, to)
    await apply(synth, facts)
  }

export const panSynthesizer = makePanSynthesizer(applyFacts)


export type ZoomSynthesizerFct = (s: Synthesizer, from: number, deltaY: number) => Promise<void>

export type ZoomSynthesizerFactory = (apply: FactsApplier<SynthesizersEffect>) => ZoomSynthesizerFct

export const makeZoomSynthesizer: ZoomSynthesizerFactory = apply =>
  async (synth, from, deltaY) => {
    const facts = zoom(synth.id as Uuid, { ...toViewport(synth), scale: from }, deltaY)
    await apply(synth, facts)
  }

const debouncedRunEffect = makeDebounce(runEffect, { delay: 500, key: e => `${e.type}:${e.id}`, scheduler: timeoutScheduler })

export const debouncedApplyFacts: FactsApplier<SynthesizersEffect> = makeApplyFacts(debouncedRunEffect)

export const zoomSynthesizer = makeZoomSynthesizer(debouncedApplyFacts)