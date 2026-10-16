export interface Result<T, E> {
  apply(fct: (t: T) => Result<T, E>): Result<T, E>
}