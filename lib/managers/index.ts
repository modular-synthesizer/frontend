import KeyboardManager from "./KeyboardManager";
import MidiManager from "./MidiManager";

export const managers = {
  midi: new MidiManager(),
  keyboard: new KeyboardManager(),
};