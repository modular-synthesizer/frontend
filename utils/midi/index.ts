import type { Synthesizer } from "~/types/Index";
import KeyboardManager from "./KeyboardManager";
import MidiManager from "./MidiManager";

export const managers = {
  midi: new MidiManager(),
  keyboard: new KeyboardManager(),
};

export function initManagers(synthesizer: Synthesizer) {
  managers.keyboard.setVoices(synthesizer.voices);
  managers.midi.setVoices(synthesizer.voices);
}