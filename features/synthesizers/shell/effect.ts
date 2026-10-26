import { assertNever } from "../../shared/facts";
import type { HttpPut } from "./api/http";
import { put } from "./api/nuxt.http";
import { saveViewport } from "./api/saveViewport.http";
import type { SynthesizersEffects } from "../core/data/Effect.type";

export type RunEffectFct = (effect: SynthesizersEffects) => Promise<void>

export type RunEffectFactory = (put: HttpPut) => RunEffectFct

export const makeRunEffect: RunEffectFactory = put => async effect => {
  switch(effect.type) {
    case "synthesizers.viewport.save":
      return (await saveViewport(put)(effect.id, effect.viewport)).or(undefined)
    default:
      return assertNever(effect.type)
  }
}

export const runEffect: RunEffectFct = makeRunEffect(put)