import { put } from "../../shared/http/nuxt.http";
import { assertNever, type RunEffectFct } from "../../shared/facts";
import type { HttpPut } from "../../shared/http/http";
import type { SynthesizersEffect } from "../core/data/Effect.type";
import { saveViewport } from "./api/saveViewport.http";
import { saveScale } from "./api/saveScale.http";
import { saveModule } from "./api/saveModule.http";
import { saveParameter } from "./api/saveParameter.http";
import { debounceById } from "../../shared/effects/debounce";

export type RunEffectFactory = (put: HttpPut) => RunEffectFct<SynthesizersEffect>

export const makeRunEffect: RunEffectFactory = put => async effect => {
  switch(effect.type) {
    case "synthesizers.viewport.save":
      return (await saveViewport(put)(effect.id, effect.viewport)).or(undefined)
    case "synthesizers.scale.save":
      return (await saveScale(put)(effect.id, effect.scale)).or(undefined)
    case "synthesizers.module.save":
      return (await saveModule(put)(effect.id, effect.placement)).or(undefined)
    case "synthesizers.parameter.save":
      return (await saveParameter(put)(effect.id, effect.moduleId, effect.value, effect.t)).or(undefined)
    default:
      return assertNever(effect)
  }
}

export const runEffect: RunEffectFct<SynthesizersEffect> = makeRunEffect(put)

export const debouncedRunEffect = debounceById(runEffect)
