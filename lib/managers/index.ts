import KeyboardManager from "./KeyboardManager";
import MidiManager from "./MidiManager";
import PortsManager from "./PortsManager";

export const managers = {
  midi: new MidiManager(),
  ports: new PortsManager(),
  keyboard: new KeyboardManager(),
};