import type { HttpError } from "../../../shared/http/http";
import type { Session } from "../data/Session.type";
import type { Result } from "../../../shared/results/result";
import type { LoginError } from "../data/LoginError.type";
import type { SessionsEffect } from "../data/Effect.type";
import { toLoginError } from "../shared/toLoginError";

export type ReceiveLoginFct = (response: Result<Session, HttpError>) =>
  { errors: LoginError[], effects: SessionsEffect[] }

export const receiveLogin: ReceiveLoginFct = response => {
  if (response.ok) {
    return { errors: [], effects: [
      { type: "sessions.session.store", session: response.orNull() },
      { type: "sessions.navigate", to: "/" }
    ] }
  }
  else {
    return {
      errors: [ toLoginError(response.error()) ],
      effects: []
    }
  }
}
