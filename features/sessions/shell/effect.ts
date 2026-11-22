import { assertNever, type RunEffectFct } from "../../shared/facts"
import type { SessionsEffect } from "../core/data/Effect.type"
import type { Session } from "../core/data/Session.type"
import { deleteSession, type DeleteSessionFct } from "./api/deleteSession.http"
import { toLegacySession } from "./legacy/session.mapper"

type StoragePort = (session: Session) => void

type NavigationPort = (to: string) => void

type ClearPort = () => void

export type SessionPorts = {
  store: StoragePort,
  navigate: NavigationPort,
  deleteSession: DeleteSessionFct,
  clear: ClearPort,
}

export type RunEffectFactory = (ports: SessionPorts) => RunEffectFct<SessionsEffect>

export const makeRunEffect: RunEffectFactory = ({ store, navigate, deleteSession, clear }) => async effect => {
  switch (effect.type) {
    case "sessions.navigate":
      return navigate(effect.to)
    case "sessions.session.store":
      return store(effect.session)
    case "sessions.session.clear":
      return clear();
    case "sessions.session.delete":
      return (await deleteSession(effect.token)).or(undefined);
    default:
      assertNever(effect)
  }
}

const ports: SessionPorts = {
  store: session => useSession().store(toLegacySession(session)),
  navigate: path => navigateTo(path),
  clear: () => useSession().clear(),
  deleteSession,
}

export const runEffect = makeRunEffect(ports)