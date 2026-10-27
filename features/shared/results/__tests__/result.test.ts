import { describe, expect, it } from "vitest";
import { ko, ok, type Result } from "../result";

describe('result', () => {
  describe(":: flatMap", () => {
    const success = (n: number): Result<string, string> => ok(`${n}`)
    const error = (_: number): Result<string, string> => ko("test error")

    it("Returns the mapped value if the provided function returns a success", () => {
      expect(ok(42).flatMap(success).orNull()).toEqual("42")
    })
    it("Returns the correct error if the provided function returns an error", () => {
      expect(ok(42).flatMap(error).error()).toEqual("test error")
    })
    it("Returns an error if an error function is called on an error", () => {
      expect(ko<number, string>("first error").flatMap(error).error()).toEqual("first error")
    })
    it("Returns error if a successful function is called on an error", () => {
      expect(ko<number, string>("first error").flatMap(success).error()).toEqual("first error")
    })
    it("Finishes returning an error if one is raised during the process", () => {
      const failure = (_: string): Result<number, string> => ko("error")
      expect(ok(42).flatMap(success).flatMap(failure).flatMap(success).error()).toEqual("error")
    })
  })
  describe(":: orNull", () => {
    it("Returns the value for a success", () => {
      expect(ok(42).orNull()).toEqual(42)
    })
    it("Returns null for an error", () => {
      expect(ko("test").orNull()).toEqual(null)
    })
  })
  describe(":: or", () => {
    it("Returns the value for a success", () => {
      expect(ok(42).or(67)).toEqual(42)
    })
    it("Returns the default value for a failure", () => {
      expect(ko(42).or(67)).toEqual(67)
    })
  })
  describe(":: error", () => {
    it("Returns null for a success", () => {
      expect(ok(42).error()).toEqual(null)
    })
    it("Returns the error for a failure", () => {
      expect(ko("error").error()).toEqual("error")
    })
  })
  describe(":: ok", () => {
    it("Returns true for a success", () => {
      expect(ok(42).ok).toEqual(true)
    })
    it("Returns false for a failure", () => {
      expect(ko("error").ok).toEqual(false)
    })
  })
})