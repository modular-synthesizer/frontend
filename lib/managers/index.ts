import type { Synthesizer } from "~/types/Index";
import KeyboardManager from "./KeyboardManager";
import MidiManager from "./MidiManager";

export const managers = {
  midi: new MidiManager(),
  keyboard: new KeyboardManager(),
  init(synthesizer: Synthesizer) {
    this.keyboard.setSynthesizer(synthesizer);
    this.midi.setSynthesizer(synthesizer);
  }
};