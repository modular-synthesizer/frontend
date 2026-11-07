import { assertNever } from "../../../shared/facts";
import type { Allocation } from "../data/Allocation.type";
import type { MidiChannel, MidiMessage } from "../data/MidiMessage.type";
import type { AllocationFacts } from "../shared/allocation";
import { MODWHEEL_CONTROLLER, MODWHEEL_RATIO } from "../shared/Constants";
import { press } from "./press.process";
import { release } from "./release.process";

export type ReceiveMessageFct = (allocation: Allocation, listening: MidiChannel, message: MidiMessage) => AllocationFacts

export const receiveMessage: ReceiveMessageFct = (allocation, listening, message) => {
  if (message.channel !== listening) return { allocation, effects: [] }

  switch (message.kind) {
    case "note.on":
      return press(allocation, message.note)
    case "note.off":
      return release(allocation, message.note)
    case "control":
      if (message.controller !== MODWHEEL_CONTROLLER) return { allocation, effects: [] }
      return { allocation, effects: [ { type: "midi.modwheel", amount: message.value / MODWHEEL_RATIO } ] }
    default:
      return assertNever(message)
  }
}