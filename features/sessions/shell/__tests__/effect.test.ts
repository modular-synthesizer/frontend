import { describe, expect, it } from "vitest";
import type { Session } from "../../core/data/Session.type";
import { makeRunEffect } from "../effect";
import type { SessionsEffect } from "../../core/data/Effect.type";
import { toObjectId } from "../../../shared/data/ObjectId.type";

function recordEffects<T>() {
  const effects: T[] = []
  const runner = (item: T) => {
    effects.push(item)
  }
  return { runner, effects }
}

describe("makeRunEffect", () => {
  it("correctly runs the storage effect", async () => {
    const { effects: navigations, runner: navigate } = recordEffects<string>()
    const { effects: storages, runner: store } = recordEffects<Session>()
    const account = { id: toObjectId('test'), username: 'testuser', email: 'email@test.com' }
    const session: Session = { token: "test.token", rights: [], admin: true, account }
    const effect: SessionsEffect = { type: "sessions.session.store", session }
    await makeRunEffect({ store, navigate })(effect)

    expect(storages).toEqual([ session ])
    expect(navigations).toEqual([])
  })
  it("correctly runs the navigation effect", async () => {
    const { effects: navigations, runner: navigate } = recordEffects<string>()
    const { effects: storages, runner: store } = recordEffects<Session>()
    const effect: SessionsEffect = { type: "sessions.navigate", to: "/synthesizers" }
    await makeRunEffect({ store, navigate })(effect)

    expect(storages).toEqual([])
    expect(navigations).toEqual([ "/synthesizers" ])
  })
  it("fails with an unknown effect",  async () => {
    const effect = { type: "unknown.type" } as unknown as SessionsEffect
    const { effects: navigations, runner: navigate } = recordEffects<string>()
    const { effects: storages, runner: store } = recordEffects<Session>()
    const runEffect = makeRunEffect({ store, navigate })

    await expect(runEffect(effect)).rejects.toThrow(JSON.stringify("unknown.type"))
    expect(navigations).toEqual([])
    expect(storages).toEqual([])
  })
})