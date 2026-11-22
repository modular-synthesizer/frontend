import { describe, expect, it } from "vitest"
import type { SessionsEffect } from "../../../core/data/Effect.type"
import { makeLogout } from "../logout.adapter"

const createRun = (failOn?: SessionsEffect["type"]) => {
  const journal: string[] = []
  const effects: SessionsEffect[] = []
  const run = async (effect: SessionsEffect) => {
    effects.push(effect)
    journal.push(`start:${effect.type}`)
    await new Promise(resolve => setTimeout(resolve, 0))
    if (effect.type === failOn) throw new Error("boom")
    journal.push(`end:${effect.type}`)
  }
  return { run, journal, effects }
}

describe("makeLogout", () => {
  it("runs the deletion, clear and navigation effects one after the other", async () => {
    const { run, journal } = createRun()
    await makeLogout(() => "test.token", run)()

    expect(journal).toEqual([
      "start:sessions.session.delete",
      "end:sessions.session.delete",
      "start:sessions.session.clear",
      "end:sessions.session.clear",
      "start:sessions.navigate",
      "end:sessions.navigate",
    ])
  })
  it("reads the token when called, not when created", async () => {
    const { run, effects } = createRun()
    let token = "a"
    const logout = makeLogout(() => token, run)
    token = "b"
    await logout()

    expect(effects[0]).toEqual({ type: "sessions.session.delete", token: "b" })
  })
  it("only clears and navigates with an empty token", async () => {
    const { run, journal } = createRun()
    await makeLogout(() => "", run)()

    expect(journal).toEqual([
      "start:sessions.session.clear",
      "end:sessions.session.clear",
      "start:sessions.navigate",
      "end:sessions.navigate",
    ])
  })
  it("lets the rejection of an effect go through and stops the following ones", async () => {
    const { run, journal } = createRun("sessions.session.delete")
    const logout = makeLogout(() => "test.token", run)

    await expect(logout()).rejects.toThrow("boom")
    expect(journal).toEqual([ "start:sessions.session.delete" ])
  })
})
