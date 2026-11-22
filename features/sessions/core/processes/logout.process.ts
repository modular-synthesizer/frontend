import type { Facts } from "../../../shared/facts";
import type { SessionsEffect } from "../data/Effect.type";

export type LogoutFct = (token: string) => Facts<SessionsEffect>

export const logout: LogoutFct = token => {
  const deletion: SessionsEffect[] = token ? [ { type: "sessions.session.delete", token } ] : []
  return {
    effects: [
      ...deletion,
      { type: "sessions.session.clear" },
      { type: "sessions.navigate", to: "/" }
    ]
  }
}
