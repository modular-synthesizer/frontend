import type { Effect } from "../../../shared/facts";
import type { Session } from "./Session.type";

export type SessionStoreEffect = { type: "sessions.session.store", session: Session }

export type SessionsEffect = Effect & (
  | SessionStoreEffect
  | { type: "sessions.session.delete", token: string }
  | { type: "sessions.session.clear" }
  | { type: "sessions.navigate", to: string }
)
