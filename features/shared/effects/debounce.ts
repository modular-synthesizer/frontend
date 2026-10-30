import type { Effect, RunEffectFct } from "../facts";

type ScheduleFct<T> = (callback: () => void, delay: number) => T

type CancelFct<T> = (handler: T) => void

type Scheduler<T> = { schedule: ScheduleFct<T>, cancel: CancelFct<T> }

export const timeoutScheduler: Scheduler<ReturnType<typeof setTimeout>> = {
  schedule: setTimeout, cancel: clearTimeout
}

type KeyBuilder<E> = (effect: E) => string

export type DebounceOptions<E extends Effect, T> = {
  delay: number, key: KeyBuilder<E>, scheduler: Scheduler<T>
}

export const makeDebounce = <E extends Effect, T>(
  run: RunEffectFct<E>,
  { delay, key, scheduler }: DebounceOptions<E, T>
): RunEffectFct<E> => {
  const pending = new Map<string, T>()
  return async effect => {
    const k = key(effect)
    const previous = pending.get(k)
    if(previous !== undefined) scheduler.cancel(previous)
    pending.set(k, scheduler.schedule(() => {
      pending.delete(k)
      run(effect).catch(() => undefined)
    }, delay))
  }
}