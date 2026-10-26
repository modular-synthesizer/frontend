import type { SynthesizersEffects } from "../core/processes/synthesizers/reset.process";
import type { HttpPut } from "./api/http";
import { put } from "./api/nuxt.http";
import { saveViewPort } from "./api/saveViewPort.http";

export type RunEffectFct = (effect: SynthesizersEffects) => Promise<void>

export type RunEffectFactory = (put: HttpPut) => RunEffectFct

export const makeRunEffect: RunEffectFactory = put => async effect => {
  switch(effect.type) {
    case "synthesizers.viewport.save":
      return (await saveViewPort(put)(effect.id, effect.viewPort)).or(undefined)
  }
}

export const runEffect: RunEffectFct = makeRunEffect(put)