import { cloneDeep, find, pull, some } from "lodash";
import IManager from "~~/lib/interfaces/IManager";
import KeyMapper from "~~/lib/interfaces/KeyMapper";
import midiListenerCallback from "~~/lib/types/midiListenerCallback";
import { useKeyboard } from "~~/stores/common/keyboard";
import keyboard from './keyboard.json'

interface ListenersList {
  noteOn: midiListenerCallback[];
  noteOff: midiListenerCallback[];
}

export default class MidiManager implements IManager {
  private listeners: ListenersList = { noteOn: [], noteOff: []};

  private keyPressed: number[] = [];

  private keyboardMap: KeyMapper[] = cloneDeep(keyboard);

  start(): void {
    this.initEvents();
  }

  stop(): void {
    this.listeners.noteOn = [];
    this.listeners.noteOff = [];
    window.onkeydown = null;
    window.onkeyup = null;
  }
  onkeydown(callback: midiListenerCallback) {
    this.listeners.noteOn.push(callback);
  }
  
  onkeyup(callback: midiListenerCallback) {
    this.listeners.noteOff.push(callback);
  }

  private initEvents() {
    window.onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') return useKeyboard().shiftOn();
      if (!some(this.keyboardMap, {key: event.code})) return;
  
      const mapper = find(this.keyboardMap, {key: event.code}) as KeyMapper;
      if (mapper.channel !== -1) return;
      const note = mapper.midicode;
  
      this.triggerListeners(this.listeners.noteOn, note, mapper);
    }
  
    window.onkeyup = (event: KeyboardEvent) => {
      if (event.key === 'Shift') return useKeyboard().shiftOff();

      const mapper = find(this.keyboardMap, {key: event.code});
      if (mapper === undefined) return;
      const note = mapper.midicode;
  
      if (note === undefined) return;
      pull(this.keyPressed, note);
      this.triggerListeners(this.listeners.noteOff, note, mapper);
    }

    navigator.requestMIDIAccess().then((access: MIDIAccess) => {
      for (let input of access.inputs.values()) {
        input.onmidimessage = (message: any): any => {
          const mapper = find(this.keyboardMap, {midicode: message.data[1]});
          if (mapper === undefined) return;
          if (message.data[0] >= 144) {
            this.triggerListeners(this.listeners.noteOn, message.data[1], mapper);
          }
          else if (message.data[0] >= 128) {
            this.triggerListeners(this.listeners.noteOff, message.data[1], mapper);
          }
        }
      }
    })
  }

  public triggerListeners(list: midiListenerCallback[], pitch: number, mapper: KeyMapper) {
    list.forEach(function(listener: midiListenerCallback) {
      listener(pitch, mapper);
    })
  }
}