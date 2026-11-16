import type { HttpRequest } from "../../shared/http/http"
import type { CableAudio } from "./audio/cable.audio"
import { assertNever, type RunEffectFct } from "../../shared/facts"
import type { CablesEffect } from "../core/data/Effect.type"
import { deleteCable } from "./api/deleteCable.http"

export type CablesPorts = { audio: CableAudio, del: HttpRequest }

export type RunEffectFactory = (ports: CablesPorts) => RunEffectFct<CablesEffect>

export const makeRunEffect: RunEffectFactory = ports => async effect => {
  switch (effect.type) {
    case "cables.audio.connect":
      return ports.audio.connect(effect.connection)
    case "cables.audio.disconnect":
      return ports.audio.disconnect(effect.connection)
    case "cables.cable.delete":
      return (await deleteCable(ports.del)(effect.id)).or(undefined)
    default:
      return assertNever(effect)
  }
}