import { describe, expectTypeOf, it } from "vitest";
import { ko, ok, type Failure, type Result, type Success } from "../result";

describe("result", () => {
  describe(":: ok / ko", () => {
    it("Infers the value type of a success and a 'never' error", () => {
      expectTypeOf(ok(42)).toEqualTypeOf<Success<number, never>>()
    })
    it("Infers the error type of a failure", () => {
      expectTypeOf(ko("error")).toEqualTypeOf<Failure<unknown, string>>()
    })
    it("Accepts explicit type parameters", () => {
      expectTypeOf(ko<number, string>("error")).toEqualTypeOf<Failure<number, string>>()
    })
  })
  describe(":: flatMap", () => {
    const toString = (n: number): Result<string, string> => ok(`${n}`)
    const toNumber = (s: string): Result<number, Error> => ok(Number(s))

    it("Returns a Result of the mapped value type", () => {
      expectTypeOf(ok(42).flatMap(toString)).toEqualTypeOf<Result<string, string>>()
    })
    it("Returns a Result, not a Success, as the outcome is only known at runtime", () => {
      expectTypeOf(ok(42).flatMap(toString)).not.toEqualTypeOf<Success<string, string>>()
    })
    it("Accumulates error types when chaining", () => {
      expectTypeOf(ok(42).flatMap(toString).flatMap(toNumber)).toEqualTypeOf<Result<number, string | Error>>()
    })
    it("Keeps the error type of a failure", () => {
      const toBoolean = (n: number): Result<boolean, Error> => ok(n > 0)
      expectTypeOf(ko<number, string>("error").flatMap(toBoolean)).toEqualTypeOf<Result<boolean, string | Error>>()
    })
    it("Only accepts functions taking the success type", () => {
      // @ts-expect-error a function on strings cannot be applied to a Result<number, ...>
      ok(42).flatMap(toNumber)
    })
  })
  describe(":: narrowing", () => {
    const result = ok<number, string>(42) as Result<number, string>

    it("Narrows to a Success when ok is true", () => {
      if (result.ok) {
        expectTypeOf(result).toEqualTypeOf<Success<number, string>>()
        expectTypeOf(result.orNull()).toEqualTypeOf<number>()
        expectTypeOf(result.error()).toEqualTypeOf<null>()
      }
    })
    it("Narrows to a Failure when ok is false", () => {
      if (!result.ok) {
        expectTypeOf(result).toEqualTypeOf<Failure<number, string>>()
        expectTypeOf(result.orNull()).toEqualTypeOf<null>()
        expectTypeOf(result.error()).toEqualTypeOf<string>()
      }
    })
  })
  describe(":: getters on a Result", () => {
    const result = ok<number, string>(42) as Result<number, string>

    it("orNull returns the value or null", () => {
      expectTypeOf(result.orNull()).toEqualTypeOf<number | null>()
    })
    it("or returns the value type", () => {
      expectTypeOf(result.or(0)).toEqualTypeOf<number>()
    })
    it("or only accepts a default of the value type", () => {
      // @ts-expect-error the default value must be a number
      result.or("zero")
    })
    it("error returns the error or null", () => {
      expectTypeOf(result.error()).toEqualTypeOf<string | null>()
    })
  })
})