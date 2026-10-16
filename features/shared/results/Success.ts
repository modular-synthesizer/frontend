import type { Result } from "./Result.interface";

export class Success<T, E> implements Result<T, E> {

  public constructor(private readonly item: T) { }

  public apply(fct: (t: T) => Result<T, E>): Result<T, E> {
    return fct(this.item)
  }
}