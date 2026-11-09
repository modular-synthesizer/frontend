import { describe, expect, it } from "vitest"
import type { MidiMessage } from "../../core/data/MidiMessage.type"
import { makeKeyboardSource } from "../keyboard"

describe("makeKeyboardSource", () => {
  const start = () => {
    const root = document.createElement("div")
    document.body.appendChild(root)
    const received: MidiMessage[] = []
    const source = makeKeyboardSource(root, message => { received.push(message) })
    return { root, received, source }
  }
  const key = (target: EventTarget, type: "keydown" | "keyup", code: string, init: KeyboardEventInit = {}) =>
    target.dispatchEvent(new KeyboardEvent(type, { code, bubbles: true, ...init }))
  const blur = (target: EventTarget) => target.dispatchEvent(new Event("blur"))
  const on = (note: number): MidiMessage => ({ kind: "note.on", channel: 0, note })
  const off = (note: number): MidiMessage => ({ kind: "note.off", channel: 0, note })

  describe("playing notes", () => {
    it("emits a note.on on the keyboard channel when a mapped key is pressed", () => {
      const { root, received } = start()
      key(root, "keydown", "KeyQ")
      expect(received).toEqual([ on(60) ])
    })
    it("emits a note.off when a mapped key is released", () => {
      const { root, received } = start()
      key(root, "keydown", "KeyQ")
      key(root, "keyup", "KeyQ")
      expect(received).toEqual([ on(60), off(60) ])
    })
    it("emits nothing for a key outside the musical keyboard", () => {
      const { root, received } = start()
      key(root, "keydown", "KeyA")
      key(root, "keyup", "KeyA")
      expect(received).toEqual([])
    })
  })

  describe("ignoring key presses", () => {
    it("ignores the automatic repetitions of a held key", () => {
      const { root, received } = start()
      key(root, "keydown", "KeyQ")
      key(root, "keydown", "KeyQ", { repeat: true })
      expect(received).toEqual([ on(60) ])
    })
    it("ignores the repetitions still received after the focus was lost and regained", () => {
      const { root, received } = start()
      key(root, "keydown", "KeyQ")
      blur(root)
      key(root, "keydown", "KeyQ", { repeat: true })
      expect(received).toEqual([ on(60), off(60) ])
    })
    it("ignores a second press of a key already held, even without the repeat flag", () => {
      const { root, received } = start()
      key(root, "keydown", "KeyQ")
      key(root, "keydown", "KeyQ")
      expect(received).toEqual([ on(60) ])
    })
    it.each([ "ctrlKey", "altKey", "metaKey" ])("ignores a press with %s", modifier => {
      const { root, received } = start()
      key(root, "keydown", "KeyQ", { [modifier]: true })
      expect(received).toEqual([])
    })
    it("still releases a key whose press was ignored because of a modifier", () => {
      const { root, received } = start()
      key(root, "keydown", "KeyQ", { ctrlKey: true })
      key(root, "keyup", "KeyQ", { ctrlKey: true })
      expect(received).toEqual([ off(60) ])
    })
  })

  describe("editable targets", () => {
    const editables: [ string, () => HTMLElement ][] = [
      [ "an input", () => document.createElement("input") ],
      [ "a textarea", () => document.createElement("textarea") ],
      [ "a select", () => document.createElement("select") ],
      [ "an element inside a contenteditable", () => {
        const editable = document.createElement("div")
        editable.setAttribute("contenteditable", "")
        return editable.appendChild(document.createElement("span"))
      } ],
    ]
    it.each(editables)("ignores a press inside %s", (_, make) => {
      const { root, received } = start()
      const element = make()
      root.appendChild(element.closest("[contenteditable]") ?? element)
      key(element, "keydown", "KeyQ")
      expect(received).toEqual([])
    })
    it("plays a press inside an element explicitly not editable", () => {
      const { root, received } = start()
      const element = document.createElement("div")
      element.setAttribute("contenteditable", "false")
      root.appendChild(element)
      key(element, "keydown", "KeyQ")
      expect(received).toEqual([ on(60) ])
    })
    it("still releases a key inside an editable target", () => {
      const { root, received } = start()
      const input = root.appendChild(document.createElement("input"))
      key(root, "keydown", "KeyQ")
      key(input, "keyup", "KeyQ")
      expect(received).toEqual([ on(60), off(60) ])
    })
  })

  describe("losing the focus", () => {
    it("releases every key still held", () => {
      const { root, received } = start()
      key(root, "keydown", "KeyQ")
      key(root, "keydown", "KeyW")
      blur(root)
      expect(received).toEqual([ on(60), on(62), off(60), off(62) ])
    })
    it("does not release again a key released before", () => {
      const { root, received } = start()
      key(root, "keydown", "KeyQ")
      key(root, "keyup", "KeyQ")
      blur(root)
      expect(received).toEqual([ on(60), off(60) ])
    })
    it("does not release twice when the focus is lost twice", () => {
      const { root, received } = start()
      key(root, "keydown", "KeyQ")
      blur(root)
      blur(root)
      expect(received).toEqual([ on(60), off(60) ])
    })
    it("does not release a key whose press was ignored", () => {
      const { root, received } = start()
      key(root, "keydown", "KeyQ", { ctrlKey: true })
      blur(root)
      expect(received).toEqual([])
    })
  })

  describe("stopping the source", () => {
    it("releases the keys still held, then emits nothing more", () => {
      const { root, received, source } = start()
      key(root, "keydown", "KeyQ")
      source.stop()
      key(root, "keydown", "KeyW")
      key(root, "keyup", "KeyQ")
      blur(root)
      expect(received).toEqual([ on(60), off(60) ])
    })
    it("emits nothing when stopped twice", () => {
      const { root, received, source } = start()
      key(root, "keydown", "KeyQ")
      source.stop()
      source.stop()
      expect(received).toEqual([ on(60), off(60) ])
    })
  })
})
