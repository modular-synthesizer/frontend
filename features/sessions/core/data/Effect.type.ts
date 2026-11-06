import type { Effect } from "../../../shared/facts";
import type { Session } from "./Session.type";

export type SessionsEffect = Effect & (
  | { type: "sessions.session.store", session: Session }
  | { type: "sessions.navigate", to: string }
)