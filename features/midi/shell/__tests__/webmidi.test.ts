import { describe, expect, it } from "vitest"
import { requestAccess, type MidiAccessLike, type MidiInputLike, type MidiNavigator } from "../webmidi"

describe("requestAccess", () => {
  it("returns a success if the request is fulfilled", async () => {
    const access = Object.assign(new EventTarget(), { inputs: new Map<string, MidiInputLike>() })
    const navigator: MidiNavigator = {
      requestMIDIAccess: async () => access
    }
    expect((await requestAccess(navigator)).orNull()).toBe(access)
  })
  it("fails with 'unsupported' if the requestMIDIAccess is unavailable", async () => {
    expect((await requestAccess({})).error()).toEqual("unsupported")
  })
  it("fails with 'denied' if the underlying request fails asynchronously", async () => {
    const navigator: MidiNavigator = {
      requestMIDIAccess: async () => {
        throw new Error("unexpected error")
      }
    }
    expect((await requestAccess(navigator)).error()).toEqual("denied")
  })
  it("fails with 'denied' if the underlying request fails synchronously", async () => {
    const navigator: MidiNavigator = {
      requestMIDIAccess: () => {
        throw new Error("unexpected error")
      }
    }
    expect((await requestAccess(navigator)).error()).toEqual("denied")
  })
  it("calls requestMIDIAccess on the navigator itself", async () => {
    const access = Object.assign(new EventTarget(), { inputs: new Map<string, MidiInputLike>() })
    const navigator: MidiNavigator = {
      requestMIDIAccess(this: MidiNavigator): Promise<MidiAccessLike> {
        return this === navigator ? Promise.resolve(access) : Promise.reject(new TypeError("Illegal invocation"))
      }
    }

    expect((await requestAccess(navigator)).orNull()).toBe(access)
  })
})