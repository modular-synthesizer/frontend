import type { RunEffectFct } from "../../../shared/facts"
import type { SessionsEffect } from "../../core/data/Effect.type"
import { logout } from "../../core/processes/logout.process"
import { runEffect } from "../effect"

export type LogoutAdapterFct = () => Promise<void>

export type LogoutAdapterFactory = (token: () => string, run: RunEffectFct<SessionsEffect>) => LogoutAdapterFct

export const makeLogout: LogoutAdapterFactory = (token, run) => async () => {
  for (const effect of logout(token()).effects) await run(effect)
}

export const logoutAdapter = makeLogout(() => useSession().token, runEffect)
