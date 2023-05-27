import { find } from "lodash";
import IManager from "~~/lib/interfaces/IManager";
import { useKeyboard } from "~~/stores/common/keyboard";
import keyboard from './keyboard.json'
import MidiDevice from "~~/lib/midi/MidiDevice";

/**
 * This class helps us trate the keyboard as a separated MIDI device. The difference with a classical MIDI device is
 * the keyboard has to have a mapping to tell us which key is mapped to which MIDI tonality message.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class KeyboardManager implements IManager {
  // This represents the mapping from a set of keyboard keys to a set of MIDI tonalities.
  private mapping: {key: string, midicode: number}[] = keyboard;

  // This represents the keyboard as a MIDI device.
  private device: MidiDevice;

  public constructor() {
    this.device = new MidiDevice(-1);
  }

  /**
   * Starts the manager by delcaring the keydown and keyup events on the main window container. Each time a key stroke
   * is not caught by another handler, it lands here and plays a note depending on the key mapping.
   */
  start(): void {
    window.onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') return useKeyboard().shiftOn();
      const mapper = find(this.mapping, {key: event.code});
      if (!!mapper) this.device.noteOn( mapper.midicode);
    }
  
    window.onkeyup = (event: KeyboardEvent) => {
      if (event.key === 'Shift') return useKeyboard().shiftOff();
      const mapper = find(this.mapping, {key: event.code});
      if (!!mapper) this.device.noteOff(mapper.midicode);
    }
  }

  /**
   * Stops the manager by deleting the keyup and keydown events from the main window so that it can't be triggered.
   */
  stop(): void {
    window.onkeydown = null;
    window.onkeyup = null;
  }
}