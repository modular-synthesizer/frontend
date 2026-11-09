import { describe, expect, it } from "vitest";
import { parseMessage } from "../parseMessage.process";

describe("parseMessage", () => {
  it("returns null on an empty data array", () => {
    expect(parseMessage([])).toBe(null)
  })
  it("returns null for a too small array", () => {
    expect(parseMessage([ 0x90, 60 ])).toBe(null)
  })
  it("returns note.on on the corresponding MIDI message", () => {
    expect(parseMessage([ 0x90, 12, 1 ])).toEqual({ kind: "note.on", channel: 1, note: 12 })
  })
  it("returns note.on on the correct canal if different from 1", () => {
    expect(parseMessage([ 0x93, 12, 1 ])).toEqual({ kind: "note.on", channel: 4, note: 12 })
  })
  it("returns note.off on a note.on message with 0 as second value", () => {
    expect(parseMessage([ 0x90, 12, 0 ])).toEqual({ kind: "note.off", channel: 1, note: 12 })
  })
  it("returns note.off on the corresponding MIDI message", () => {
    expect(parseMessage([ 0x80, 12, 0 ])).toEqual({ kind: "note.off", channel: 1, note: 12 })
  })
  it("returns control on the corresponding MIDI message", () => {
    expect(parseMessage([ 0xB0, 12, 42 ])).toEqual({ kind: "control", channel: 1, controller: 12, value: 42 })
  })
  it("correctly detects channel 16", () => {
    expect(parseMessage([ 0x9F, 60, 100 ])).toEqual({ kind: "note.on", channel: 16, note: 60 })
  })

  // TODO : one day, handle these kinds of MIDI events too - not planned yet

  it("fails on a pitchbend message", () => {
    expect(parseMessage([ 0xE0, 12, 1 ])).toBe(null)
  })
  it("fails on a program change event", () => {
    expect(parseMessage([ 0xC0, 12, 1 ])).toBe(null)
  })
  it("fails on a 0xF8 message", () => {
    expect(parseMessage([ 0xF8, 12, 1 ])).toBe(null)
  })
  it("fails on a 0xFE message", () => {
    expect(parseMessage([ 0xFE, 12, 1 ])).toBe(null)
  })
})