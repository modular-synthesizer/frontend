import GatesManager from "./GatesManager";
import KeyboardManager from "./KeyboardManager";
import MidiManager from "./MidiManager";

export const managers = {
  midi: new MidiManager(),
  gates: new GatesManager(),
  keyboard: new KeyboardManager(),
};