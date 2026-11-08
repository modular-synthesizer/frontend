import { keyToMessage, type KeyEvent } from "../core/processes/keyboard.process"
import type { EmitFct } from "./hub"
import type { MidiSource } from "./source"

export type KeyboardSourceFactory = (target: EventTarget, emit: EmitFct) => MidiSource

const EDITABLE = "input, textarea, select, [contenteditable]:not([contenteditable='false'])"

const isEditable = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest(EDITABLE) !== null

export const makeKeyboardSource: KeyboardSourceFactory = (target, emit) => {
  const pressed = new Set<string>()

  const send = (code: string, event: KeyEvent) => {
    const message = keyToMessage(code, event)
    if (message) emit(message)
  }

  const onKeyDown = (event: Event) => {
    const { code, repeat, ctrlKey, altKey, metaKey } = event as KeyboardEvent
    if (repeat || ctrlKey || altKey || metaKey || isEditable(event.target)) return
    if (pressed.has(code)) return
    pressed.add(code)
    send(code, "keydown")
  }

  const onKeyUp = (event: Event) => {
    const { code } = event as KeyboardEvent
    pressed.delete(code)
    send(code, "keyup")
  }

  const onBlur = () => {
    for (const code of pressed) send(code, "keyup")
    pressed.clear()
  }

  target.addEventListener("keydown", onKeyDown)
  target.addEventListener("keyup", onKeyUp)
  target.addEventListener("blur", onBlur)

  return {
    stop: () => {
      target.removeEventListener("keydown", onKeyDown)
      target.removeEventListener("keyup", onKeyUp)
      target.removeEventListener("blur", onBlur)
      onBlur()
    }
  }
}
