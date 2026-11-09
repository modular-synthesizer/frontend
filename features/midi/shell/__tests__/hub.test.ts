import { describe, expect, it } from "vitest";
import type { MidiMessage } from "../../core/data/MidiMessage.type";
import { makeHub, type EmitFct, type UnsubscribeFct } from "../hub";

describe("makeHub", () => {

  const createRecorder = () => {
    const messages: MidiMessage[] = []
    const callback: EmitFct = message => { messages.push(message) }
    return { callback, messages }
  }

  it("forwards a message correctly to a subscribed listener", () => {
    const hub = makeHub()
    const { callback, messages } = createRecorder()
    hub.listen(callback)
    hub.emit({ kind: "note.off", channel: 4, note: 81 })

    expect(messages).toEqual([ { kind: "note.off", channel: 4, note: 81 } ])
  })
  it("forwards several messages in a row to the same listener", () => {
    const hub = makeHub()
    const { callback, messages } = createRecorder()
    hub.listen(callback)
    hub.emit({ kind: "note.off", channel: 4, note: 81 })
    hub.emit({ kind: "note.on", channel: 4, note: 81 })
    hub.emit({ kind: "control", channel: 4, controller: 12, value: 127 })

    expect(messages).toEqual([
      { kind: "note.off", channel: 4, note: 81 },
      { kind: "note.on", channel: 4, note: 81 },
      { kind: "control", channel: 4, controller: 12, value: 127 }
    ])
  })
  it("does not forward messages to unsubscribed listeners", () => {
    const hub = makeHub()
    const { callback, messages } = createRecorder()

    const unsubscribe = hub.listen(callback)
    unsubscribe()
    hub.emit({ kind: "note.off", channel: 4, note: 81 })

    expect(messages).toEqual([])
  })
  it("only unsubscribes one subscriber when calling for an unsubscribe", () => {
    const hub = makeHub()
    const { callback, messages } = createRecorder()
    const listener: EmitFct = () => {}

    hub.listen(callback)
    const unsubscribe = hub.listen(listener)
    unsubscribe()
    hub.emit({ kind: "note.off", channel: 4, note: 81 })

    expect(messages).toEqual([ { kind: "note.off", channel: 4, note: 81 } ])
  })
  it("forwards a message to all the listeners", () => {
    const hub = makeHub()
    const { callback, messages } = createRecorder()
    const { callback: otherCallback, messages: otherMessages } = createRecorder()
    hub.listen(callback)
    hub.listen(otherCallback)
    hub.emit({ kind: "note.off", channel: 4, note: 81 })

    expect(messages).toEqual([ { kind: "note.off", channel: 4, note: 81 } ])
    expect(otherMessages).toEqual([ { kind: "note.off", channel: 4, note: 81 } ])
  })
  it("sends the messages in the order of the listeners", () => {
    const hub = makeHub()
    const messages: { listener: string, message: MidiMessage }[] = []
    const callback: EmitFct = message => { messages.push({ listener: "first", message }) }
    const otherCallback: EmitFct = message => { messages.push({ listener: "second", message }) }

    hub.listen(callback)
    hub.listen(otherCallback)

    hub.emit({ kind: "note.off", channel: 4, note: 81 })

    expect(messages).toEqual([
      { listener: "first", message: { kind: "note.off", channel: 4, note: 81 } },
      { listener: "second", message: { kind: "note.off", channel: 4, note: 81 } },
    ])
  })
  it("segregates hubs if several are created", () => {
    const hub = makeHub()
    const otherHub = makeHub()
    const messages: { hub: string, message: MidiMessage }[] = []

    const callback: (hub: string) => EmitFct = hub => message => { messages.push({ hub, message }) }

    hub.listen(callback("first"))
    otherHub.listen(callback("second"))

    hub.emit({ kind: "note.off", channel: 4, note: 81 })

    expect(messages).toEqual([ { hub: "first", message: { kind: "note.off", channel: 4, note: 81 } } ])
  })
  it("only sends the message once if the listener is declared twice", () => {
    const hub = makeHub()
    const { callback, messages } = createRecorder()

    hub.listen(callback)
    hub.listen(callback)

    hub.emit({ kind: "note.off", channel: 4, note: 81 })

    expect(messages).toEqual([ { kind: "note.off", channel: 4, note: 81 } ])
  })
  it("still delivers the current message to a listener unsubscribed during the emission", () => {
    const hub = makeHub()
    const received: string[] = []
    const message: MidiMessage = { kind: "note.off", channel: 4, note: 81 }

    let unsubscribeSecond: UnsubscribeFct = () => {}
    hub.listen(() => { received.push("first"); unsubscribeSecond() })
    unsubscribeSecond = hub.listen(() => { received.push("second") })

    hub.emit(message)
    hub.emit(message)

    expect(received).toEqual([ "first", "second", "first" ])
  })
})