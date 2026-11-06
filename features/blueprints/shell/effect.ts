import { put } from "../../shared/http/nuxt.http";
import { assertNever, type RunEffectFct } from "../../shared/facts";
import type { HttpRequest } from "../../shared/http/http";
import type { BlueprintsEffect } from "../core/data/Effect.type";
import { saveViewport } from "./api/saveViewport.http";
import { saveNode } from "./api/saveNode.http";

export type RunEffectFactory = (put: HttpRequest) => RunEffectFct<BlueprintsEffect>

export const makeRunEffect: RunEffectFactory = put => async effect => {
  switch(effect.type) {
    case "blueprints.viewport.save":
      return (await saveViewport(put)(effect.id, effect.viewport)).or(undefined)
    case "blueprints.node.save":
      return (await saveNode(put)(effect.blueprintId, effect.id, effect.position)).or(undefined)
    default:
      return assertNever(effect)
  }
}

export const runEffect: RunEffectFct<BlueprintsEffect> = makeRunEffect(put)