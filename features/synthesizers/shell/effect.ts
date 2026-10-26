import type { SynthesizersEffects } from "../core/processes/synthesizers/reset.process";
import { put } from "./api/nuxt.http";
import { saveViewPort } from "./api/saveViewPort.http";

export type RunEffectFct<T> = (effect: T) => Promise<void>

export const runEffect: RunEffectFct<SynthesizersEffects> = async effect => {
  switch(effect.type) {
    case "synthesizers.viewport.save":
      return (await saveViewPort(put)(effect.id, effect.viewPort)).or(undefined)
  }
}