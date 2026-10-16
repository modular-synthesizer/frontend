import type { Result } from "./Result.interface";

export class Failure<T, E> implements Result<T, E> {

  public constructor(private readonly error: E) { }

  public apply(_: (t: T) => Result<T, E>): Result<T, E> {
    return this
  }
}