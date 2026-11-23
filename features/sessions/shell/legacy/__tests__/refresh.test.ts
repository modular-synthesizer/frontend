import { describe, expect, it } from "vitest"
import type { Session } from "../../../core/data/Session.type"
import type { SessionsEffect } from "../../../core/data/Effect.type"
import type { GetSessionFct } from "../../api/getSession.http"
import type { HttpError } from "../../../../shared/http/http"
import { ko, ok, type Result } from "../../../../shared/results/result"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import { makeRefresh } from "../refresh.adapter"

const session: Session = deepFreeze({
  token: "a", admin: true, rights: [ "first.right" ],
  account: { id: toObjectId("account.id"), username: "testuser", email: "test@mail.com" }
})

type Options = {
  token: string
  response?: Result<Session, HttpError>
  rejection?: Error
  tokenAfterFetch?: string
}

const createRefresh = ({ token, response = ok(session), rejection, tokenAfterFetch }: Options) => {
  const state = { token }
  const fetched: string[] = []
  const fetch: GetSessionFct = async sent => {
    fetched.push(sent)
    await new Promise(resolve => setTimeout(resolve, 0))
    if (tokenAfterFetch !== undefined) state.token = tokenAfterFetch
    if (rejection) throw rejection
    return response
  }
  const effects: SessionsEffect[] = []
  const run = async (effect: SessionsEffect) => { effects.push(effect) }
  const refresh = makeRefresh(() => state.token, fetch, run)

  return { refresh, fetched, effects }
}

describe("makeRefresh", () => {
  it("neither fetches nor runs any effect with an empty token", async () => {
    const { refresh, fetched, effects } = createRefresh({ token: "" })
    await refresh()

    expect(fetched).toEqual([])
    expect(effects).toEqual([])
  })
  it("fetches once with the token, then stores the received session", async () => {
    const { refresh, fetched, effects } = createRefresh({ token: "a" })
    await refresh()

    expect(fetched).toEqual([ "a" ])
    expect(effects).toEqual([ { type: "sessions.session.store", session } ])
    expect((effects[0] as { session: Session }).session).toBe(session)
  })
  it("runs no effect if the user logged out during the request", async () => {
    const { refresh, effects } = createRefresh({ token: "a", tokenAfterFetch: "" })
    await refresh()

    expect(effects).toEqual([])
  })
  it("runs no effect on a 500 error", async () => {
    const error = ko<Session, HttpError>({ status: 500, key: "unknown", message: "unknown" })
    const { refresh, fetched, effects } = createRefresh({ token: "a", response: error })
    await refresh()

    expect(fetched).toEqual([ "a" ])
    expect(effects).toEqual([])
  })
  it("lets a rejection of the fetch go through and runs no effect", async () => {
    const { refresh, effects } = createRefresh({ token: "a", rejection: new Error("network down") })

    await expect(refresh()).rejects.toThrow("network down")
    expect(effects).toEqual([])
  })
})