import type { Viewport } from "../../core/data/Viewport.type";
import type { ScaledCoordinates } from "~/types/utils/Coordinates";
import type { Effect, RunEffectFct } from "../../../shared/facts";

export type ViewportFacts<E extends Effect> = { viewport: Viewport, effects: E[] }

export type ToViewportFct = (legacy: ScaledCoordinates) => Viewport

export const toViewport: ToViewportFct = legacy => ({
  position: { x: legacy.x, y: legacy.y }, scale: legacy.scale
})

export type ApplyViewportFct = (legacy: ScaledCoordinates, viewport: Viewport) => void

export const applyViewport: ApplyViewportFct = (legacy, viewport) => {
  legacy.x = viewport.position.x
  legacy.y = viewport.position.y
  legacy.scale = viewport.scale
}

export type FactsApplier<E extends Effect> = (legacy: ScaledCoordinates, facts: ViewportFacts<E>) => Promise<void>

export type FactsApplierFactory = <E extends Effect>(run: RunEffectFct<E>) => FactsApplier<E>

export const makeApplyFacts: FactsApplierFactory = run => async (legacy, { viewport, effects }) => {
  applyViewport(legacy, viewport)
  await Promise.all(effects.map(run))
}