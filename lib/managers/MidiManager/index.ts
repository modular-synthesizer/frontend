import { cloneDeep, find, includes, pull, remove, some } from "lodash";
import IManager from "~~/lib/interfaces/IManager";
import KeyMapper from "~~/lib/interfaces/KeyMapper";
import midiListenerCallback from "~~/lib/types/midiListenerCallback";
import { useKeyboard } from "~~/stores/common/keyboard";
import keyboard from './keyboard.json'
import { eventbus } from "~~/lib/utils/eventbus/EventBus";

interface ListenersList {
  noteOn: midiListenerCallback[];
  noteOff: midiListenerCallback[];
}

export default class MidiManager implements IManager {
  private listeners: ListenersList = { noteOn: [], noteOff: []};

  private keyboardMap: KeyMapper[] = cloneDeep(keyboard);

  private pressed: string[] = []

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
    eventbus.subscribe('midi/trigger/[channel]', callback);
  }
  
  onkeyup(callback: midiListenerCallback) {
    eventbus.subscribe('midi/release/[channel]', callback);
  }

  private initEvents() {
    window.onkeydown = (event: KeyboardEvent) => {
      if (includes(this.pressed, event.code)) return;
      if (event.key === 'Shift') return useKeyboard().shiftOn();
      if (!some(this.keyboardMap, {key: event.code})) return;
  
      const mapper = find(this.keyboardMap, {key: event.code}) as KeyMapper;
      if (mapper.channel !== -1) return;
      const note = mapper.midicode;
      this.pressed.push(event.code);
  
      eventbus.emit('midi/trigger/-1', { note, mapper });
    }
  
    window.onkeyup = (event: KeyboardEvent) => {
      this.pressed = this.pressed.filter(k => k !== event.code);
      if (event.key === 'Shift') return useKeyboard().shiftOff();

      const mapper = find(this.keyboardMap, {key: event.code});
      if (mapper === undefined) return;
      const note = mapper.midicode;
  
      if (note === undefined) return;
      eventbus.emit('midi/release/-1', { note, mapper });
    }

    navigator.requestMIDIAccess().then((access: MIDIAccess) => {
      for (let input of access.inputs.values()) {
        input.onmidimessage = (message: any): any => {
          const mapper = find(this.keyboardMap, {midicode: message.data[1]});
          if (mapper === undefined) return;
          const kind: number = message.data[0];
          if (kind >= 144 && kind < 160) {
            const channel = 159 - kind;
            eventbus.emit(`midi/trigger/${channel}`, {note: message.data[1], mapper});
          }
          else if (kind >= 128 && kind < 144) {
            const channel = 143 - kind;
            eventbus.emit(`midi/release/${channel}`, {note: message.data[1], mapper})
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