import { describe, expect, it } from "vitest";
import { makeDebounce, type DebounceOptions } from "../debounce";
import type { RunEffectFct } from "../../facts";

type TestEffect = { type: "test.effect", k: number } | { type: "test.other" }

const createScheduler = () => {
  const scheduled: { callback: () => void, delay: number }[] = []
  const cancelled: number[] = []
  const scheduler: DebounceOptions<TestEffect, number>["scheduler"] = {
    schedule: (callback, delay) => {
      return scheduled.push({ callback, delay }) - 1
    },
    cancel: handle => { cancelled.push(handle) }
  }
  return { scheduler, scheduled, cancelled }
}

const createRunner = () => {
  const calls: TestEffect[] = []
  const run: RunEffectFct<TestEffect> = async effect => {
    calls.push(effect)
  }
  return { calls, run }
}

describe('makeDebounce', () => {
  const effect: TestEffect = { type: "test.effect", k: 0 }

  it("schedules one call", async () => {
    const { run, calls } = createRunner()
    const { scheduler, scheduled } = createScheduler()
    const debounce = makeDebounce(run, { scheduler, delay: 1000, key: e => e.type })
    await debounce(effect)

    expect(calls).toEqual([])
    scheduled[0]?.callback()

    expect(scheduled.length).toBe(1)
    expect(scheduled[0]?.delay).toEqual(1000)
    expect(calls).toEqual([ effect ])
  })
  it("schedules two calls with the same key, overwriting the first scheduled call", async () => {
    const { run, calls } = createRunner()
    const { scheduler, scheduled, cancelled } = createScheduler()
    const debounce = makeDebounce(run, { scheduler, delay: 1000, key: e => e.type })
    await debounce(effect)
    await debounce({ ...effect, k: 1})
    scheduled[1]?.callback()

    expect(scheduled.length).toBe(2)
    expect(cancelled).toEqual([0])
    expect(calls).toEqual([ { ...effect, k: 1 } ])
  })
  it("schedules two calls with different keys", async () => {
    const { run, calls } = createRunner()
    const { scheduler, scheduled, cancelled } = createScheduler()
    const debounce = makeDebounce(run, { scheduler, delay: 1000, key: e => e.type })
    await debounce(effect)
    await debounce({ type: "test.other" })
    scheduled[0]?.callback()
    scheduled[1]?.callback()

    expect(scheduled.length).toBe(2)
    expect(cancelled).toEqual([])
    expect(calls).toEqual([ effect, { type: "test.other" } ])
  })
  it("silences errors when an exception is raised while running", async () => {
    const { scheduler, scheduled } = createScheduler()
    const run: RunEffectFct<TestEffect> = async () => { throw new Error("Unexpected error") }
    const debounce = makeDebounce(run, { scheduler, delay: 1000, key: e => e.type })
    await debounce(effect)
    scheduled[0]?.callback()

    expect(scheduled.length).toBe(1)
  })
  it("correctly calls for another effect after a similar one has been debounced", async () => {
    const { run, calls } = createRunner()
    const { scheduler, scheduled, cancelled } = createScheduler()
    const debounce = makeDebounce(run, { scheduler, delay: 1000, key: e => e.type })
    await debounce(effect)
    scheduled[0]?.callback()
    await debounce({ ...effect, k: 1})
    scheduled[1]?.callback()

    expect(scheduled.length).toBe(2)
    expect(cancelled).toEqual([])
    expect(calls).toEqual([ effect, { ...effect, k: 1 } ])
  })
})