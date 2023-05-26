import { cloneDeep, find, includes, pull, remove, some } from "lodash";
import IManager from "~~/lib/interfaces/IManager";
import KeyMapper from "~~/lib/interfaces/KeyMapper";
import midiListenerCallback from "~~/lib/types/midiListenerCallback";
import { useKeyboard } from "~~/stores/common/keyboard";
import keyboard from './keyboard.json'
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import MidiDevice from "~~/lib/midi/MidiDevice";

interface ListenersList {
  noteOn: midiListenerCallback[];
  noteOff: midiListenerCallback[];
}

export default class MidiManager implements IManager {
  private listeners: ListenersList = { noteOn: [], noteOff: []};

  private keyboardMap: KeyMapper[] = cloneDeep(keyboard);

  private devices: MidiDevice[] = [];

  start(): void {
    this.initEvents();
  }

  stop(): void {
    this.listeners.noteOn = [];
    this.listeners.noteOff = [];
    this.devices.forEach((d: MidiDevice) => d.terminate());
    this.devices = [];
    eventbus.destroy('midi');
    window.onkeydown = null;
    window.onkeyup = null;
  }

  private initEvents() {
    window.onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') return useKeyboard().shiftOn();
      const mapper = find(this.keyboardMap, {key: event.code}) as KeyMapper;
      if (mapper !== undefined) {
        const note = mapper.midicode;
        this.getOrCreateDevice(-1).noteOn(note);
      }
    }
  
    window.onkeyup = (event: KeyboardEvent) => {
      if (event.key === 'Shift') return useKeyboard().shiftOff();
      const mapper = find(this.keyboardMap, {key: event.code}) as KeyMapper;
      if (mapper !== undefined) {
        const note = mapper.midicode;
        this.getOrCreateDevice(-1).noteOff(note);
      }
    }

    navigator.requestMIDIAccess().then((access: MIDIAccess) => {
      for (let input of access.inputs.values()) {
         this.bindEvents(input);
      }
      // This allows the dynamic plugging of MIDI keyboards
      access.onstatechange = (event: Event) => {
        if (event instanceof MIDIConnectionEvent) {
          if (event.port instanceof MIDIInput && event.port.state === 'connected') {
            this.bindEvents(event.port);
          }
        }
      }
    })
  }

  public bindEvents(input: MIDIInput) {
    input.onmidimessage = (message: any): any => {
      const channel = message.data[0] % 16;
      const device: MidiDevice = this.getOrCreateDevice(channel);
      device.message(message.data[0] - channel, message.data);
    }
    return input;
  }

  private getOrCreateDevice(midichannel: number) {
    if (this.devices[midichannel] === undefined) {
      this.devices[midichannel] = new MidiDevice(midichannel);
    }
    return this.devices[midichannel];
  }
}