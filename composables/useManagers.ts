import GatesManager from "~~/lib/managers/GatesManager";
import MidiManager from "~~/lib/managers/MidiManager";

export const midiManager: MidiManager = new MidiManager();
export const gatesManager: GatesManager = new GatesManager();

export function startManagers() {
  midiManager.start();
  gatesManager.start();
}

export function stopManagers() {
  midiManager.stop();
  gatesManager.stop();
}