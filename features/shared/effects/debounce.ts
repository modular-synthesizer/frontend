import { DEBOUNCE_DELAY } from "../data/Constants";
import type { ObjectId } from "../data/ObjectId.type";
import type { Effect, RunEffectFct } from "../facts";

type ScheduleFct<T> = (callback: () => void, delay: number) => T

type CancelFct<T> = (handler: T) => void

type Scheduler<T> = { schedule: ScheduleFct<T>, cancel: CancelFct<T> }

export const timeoutScheduler: Scheduler<ReturnType<typeof setTimeout>> = {
  schedule: setTimeout.bind(window), cancel: clearTimeout.bind(window)
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

export type DebounceByIdFct = <E extends Effect & { id: ObjectId }>(run: RunEffectFct<E>) => RunEffectFct<E>

export type DebounceByIdFactory = <S>(scheduler: Scheduler<S>) => DebounceByIdFct

export const makeDebounceById: DebounceByIdFactory = scheduler =>
  run => makeDebounce(run, { delay: DEBOUNCE_DELAY, key: e => `${e.type}:${e.id}`, scheduler })

export const debounceById = makeDebounceById(timeoutScheduler)
