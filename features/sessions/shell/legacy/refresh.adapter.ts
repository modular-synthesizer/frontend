import type { RunEffectFct } from "../../../shared/facts"
import { type GetSessionFct, getSession } from "../api/getSession.http"
import type { SessionsEffect } from "../../core/data/Effect.type"
import { isAuthenticated } from "../../core/shared/isAuthenticated"
import { receiveRefresh } from "../../core/processes/receiveRefresh.process"
import { runEffect } from "../effect"

export type RefreshAdapterFct = () => Promise<void>

export type RefreshAdapterFactory =
  (token: () => string, fetch: GetSessionFct, run: RunEffectFct<SessionsEffect>) => RefreshAdapterFct

export const makeRefresh: RefreshAdapterFactory = (token, fetch, run) => async () => {
  const sent = token()
  if (!isAuthenticated(sent)) return
  const response = await fetch(sent)
  for (const effect of receiveRefresh(sent, token(), response).effects) await run(effect)
}

export const refreshAdapter = makeRefresh(() => useSession().token, getSession, runEffect)