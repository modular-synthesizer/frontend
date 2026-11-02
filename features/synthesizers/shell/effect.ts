import { put } from "../../shared/http/nuxt.http";
import { assertNever, type RunEffectFct } from "../../shared/facts";
import type { HttpPut } from "../../shared/http/http";
import type { SynthesizersEffect } from "../core/data/Effect.type";
import { saveViewport } from "./api/saveViewport.http";
import { saveScale } from "./api/saveScale.http";
import { saveModule } from "./api/saveModule.http";

export type RunEffectFactory = (put: HttpPut) => RunEffectFct<SynthesizersEffect>

export const makeRunEffect: RunEffectFactory = put => async effect => {
  switch(effect.type) {
    case "synthesizers.viewport.save":
      return (await saveViewport(put)(effect.id, effect.viewport)).or(undefined)
    case "synthesizers.scale.save":
      return (await saveScale(put)(effect.id, effect.scale)).or(undefined)
    case "synthesizers.module.save":
      return (await saveModule(put)(effect.id, effect.placement)).or(undefined)
    default:
      return assertNever(effect)
  }
}

export const runEffect: RunEffectFct<SynthesizersEffect> = makeRunEffect(put)
