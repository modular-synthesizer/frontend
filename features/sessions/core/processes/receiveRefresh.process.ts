import type { Result } from "../../../shared/results/result";
import type { Session } from "../data/Session.type";
import type { HttpError } from "../../../shared/http/http";
import type { SessionsEffect } from "../data/Effect.type";
import type { Facts } from "../../../shared/facts";

export type ReceiveRefreshFct = (
  sent: string,
  current: string,
  response: Result<Session, HttpError>
) => Facts<SessionsEffect>

export const receiveRefresh: ReceiveRefreshFct = (sent, current, response) => {
  const effects: SessionsEffect[] = []
  if (response.ok && current === sent) effects.push({ type: "sessions.session.store", session: response.orNull() })
  return { effects }
}
