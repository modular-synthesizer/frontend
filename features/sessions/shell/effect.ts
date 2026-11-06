import { assertNever, type RunEffectFct } from "../../shared/facts"
import type { SessionsEffect } from "../core/data/Effect.type"
import type { Session } from "../core/data/Session.type"
import { toLegacySession } from "./legacy/mappers/session.mapper"

type StoragePort = (session: Session) => void

type NavigationPort = (to: string) => void

export type SessionPorts = { store: StoragePort, navigate: NavigationPort }

export type RunEffectFactory = (ports: SessionPorts) => RunEffectFct<SessionsEffect>

export const makeRunEffect: RunEffectFactory = ({ store, navigate }) => async effect => {
  switch (effect.type) {
    case "sessions.navigate":
      return navigate(effect.to)
    case "sessions.session.store":
      return store(effect.session)
    default:
      assertNever(effect)
  }
}

const ports: SessionPorts = {
  store: session => useSession().store(toLegacySession(session)),
  navigate: path => navigateTo(path)
}

export const runEffect = makeRunEffect(ports)