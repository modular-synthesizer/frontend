interface FlatMappable<T, E> {
  flatMap<U, F>(fct: (t: T) => Result<U, F>): Result<U, E|F>
}

interface Gettable<T, E> {
  orNull(): T | null
  or(otherwise: T): T
  error(): E | null
  ok: boolean
}

export class Success<T, E> implements FlatMappable<T, E>, Gettable<T, E> {

  public readonly ok = true as const

  public constructor(protected readonly t: T) { }

  public flatMap<U, F>(fct: (t: T) => Result<U, F>): Result<U, E|F> {
    return fct(this.t)
  }

  public orNull(): T {
    return this.t
  }

  public or(_: T): T {
    return this.t
  }

  public error(): null {
    return null
  }
}

export const ok = <T, E = never>(t: T) => new Success<T, E>(t)

export class Failure<T, E> implements FlatMappable<T, E>, Gettable<T, E> {

  public readonly ok = false as const

  public constructor(protected readonly e: E) { }

  public flatMap<U, F>(_: (t: T) => Result<U, F>): Result<U, E|F> {
    return ko(this.e)
  }

  public orNull(): null {
    return null
  }

  public or(otherwise: T): T {
    return otherwise
  }

  public error(): E {
    return this.e
  }
}

export const ko = <T = unknown, E = never>(e: E) => new Failure<T, E>(e)

export type Result<T, E> = Success<T, E> | Failure<T, E>