import { describe, expect, it } from "vitest";
import type { Learning } from "../../data/Learning.type";
import type { MidiMessage } from "../../data/MidiMessage.type";
import { receiveControl } from "../receiveControl.process";
import { toObjectId } from "../../../../shared/data/ObjectId.type";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";

describe("receiveControl", () => {
  it("does nothing when it receives a note.on message", () => {
    const learning: Learning = { bindings: { "2:12": [ toObjectId("test") ] }, pending: toObjectId("any") }
    const message: MidiMessage = { kind: "note.on", channel: 1, note: 60 }

    expect(receiveControl(learning, message)).toEqual({
      learning: { bindings: { "2:12": [ "test" ] }, pending: "any" }, targets: []
    })
  })
  it("does nothing when it receives a note.off message", () => {
    const learning: Learning = { bindings: {"2:13": [ toObjectId("something") ] }, pending: toObjectId("anything") }
    const message: MidiMessage = { kind: "note.off", channel: 1, note: 60 }

    expect(receiveControl(learning, message)).toEqual({
      learning: { bindings: { "2:13": [ "something" ] }, pending: "anything" }, targets: []
    })
  })
  it("does nothing when it receives a control with controller one (modwheel)", () => {
    const learning: Learning = { bindings: { "1:1": [ toObjectId("test") ]}, pending: toObjectId("pending")  }
    const message: MidiMessage = { kind: "control", channel: 1, controller: 1, value: 127 }

    expect(receiveControl(learning, message)).toEqual({
      learning: { bindings: { "1:1": [ "test" ]}, pending: "pending" }, targets: []
    })
  })
  it("triggers a targeted event if the control was listened to", () => {
    const learning: Learning = { bindings: { "1:12": [ toObjectId("test") ] }, pending: null }
    const message: MidiMessage = { kind: "control", channel: 1, controller: 12, value: 20 }

    expect(receiveControl(learning, message)).toEqual({
      learning: { bindings: { "1:12": [ "test" ] }, pending: null }, targets: [ { id: "test", amount: 20 } ]
    })
  })
  it("only triggers the event on the corresponding channel", () => {
    const learning: Learning = { bindings: { "1:12": [ toObjectId("test") ], "2:12": [ toObjectId("other") ] }, pending: null }
    const message: MidiMessage = { kind: "control", channel: 1, controller: 12, value: 83 }

    expect(receiveControl(learning, message)).toEqual({
      learning: { bindings: { "1:12": [ "test" ], "2:12": [ "other" ] }, pending: null },
      targets: [ { id: "test", amount: 83 } ]
    })
    expect(receiveControl(learning, { ...message, channel: 2 })).toEqual({
      learning: { bindings: { "1:12": [ "test" ], "2:12": [ "other" ] }, pending: null },
      targets: [ { id: "other", amount: 83 } ]
    })
  })
  it("triggers a targeted event if the control was listened to several times", () => {
    const learning: Learning = {
      bindings: { "1:12": [ toObjectId("test"), toObjectId("second") ] },
      pending: null
    }
    const message: MidiMessage = { kind: "control", channel: 1, controller: 12, value: 127 }

    expect(receiveControl(learning, message)).toEqual({
      learning: { bindings: { "1:12": [ "test", "second" ] }, pending: null }, targets: [
        { id: "test", amount: 127 }, { id: "second", amount: 127 }
      ]
    })
  })
  it("triggers a targeted event once if the objectId was both pending and listening to the message", () => {
    const learning: Learning = {
      bindings: { "2:12": [ toObjectId("test") ] },
      pending: toObjectId("test")
    }
    const message: MidiMessage = { kind: "control", channel: 2, controller: 12, value: 127 }

    expect(receiveControl(learning, message)).toEqual({
      learning: { bindings: { "2:12": [ "test" ] }, pending: null }, targets: [
        { id: "test", amount: 127 }
      ]
    })
  })
  it("triggers no event if the associated control is not listened to", () => {
    const learning: Learning = { bindings: { "1:12": [ toObjectId("test") ] }, pending: null }
    const message: MidiMessage = { kind: "control", channel: 3, controller: 12, value: 127 }

    expect(receiveControl(learning, message)).toEqual({
      learning: { bindings: { "1:12": [ "test" ] }, pending: null }, targets: []
    })
  })
  it("binds the key to the target if it was pending, then triggers the event", () => {
    const learning: Learning = { bindings: { "1:12": [ toObjectId("test") ] }, pending: toObjectId("pending") }
    const message: MidiMessage = { kind: "control", channel: 2, controller: 8, value: 127 }

    expect(receiveControl(learning, message)).toEqual({
      learning: { bindings: { "1:12": [ "test" ], "2:8": [ "pending" ] }, pending: null },
      targets: [ { id: "pending", amount: 127 } ]
    })
  })
  it("binds the key to the target if it was pending, and triggers events for the added and already bound objectIds", () => {
    const learning: Learning = { bindings: { "1:12": [ toObjectId("test") ] }, pending: toObjectId("pending") }
    const message: MidiMessage = { kind: "control", channel: 1, controller: 12, value: 127 }

    expect(receiveControl(learning, message)).toEqual({
      learning: { bindings: { "1:12": [ "test", "pending" ] }, pending: null },
      targets: [ { id: "test", amount: 127 }, { id: "pending", amount: 127 } ]
    })
  })
  it("binds the objectId to a second binding key, even if it was already bound", () => {
    const learning: Learning = { bindings: { "1:12": [ toObjectId("test") ] }, pending: toObjectId("test") }
    const message: MidiMessage = { kind: "control", channel: 2, controller: 8, value: 127 }

    expect(receiveControl(learning, message)).toEqual({
      learning: { bindings: { "1:12": [ "test" ], "2:8": [ "test" ] }, pending: null },
      targets: [ { id: "test", amount: 127 } ]
    })
  })
  it("can handle frozen objects", () => {
    const learning: Learning = deepFreeze({ bindings: { "1:8": [ toObjectId("test") ]}, pending: toObjectId("pending") })
    const message: MidiMessage = deepFreeze({ kind: "control", channel: 1, controller: 8, value: 127 })
    const before = structuredClone(learning)

    expect(() => receiveControl(learning, message)).not.toThrow()
    expect(learning).toEqual(before)
  })
})