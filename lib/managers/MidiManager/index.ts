import { find, pull, some } from "lodash";
import IManager from "~~/lib/interfaces/IManager";
import KeyMapper from "~~/lib/interfaces/KeyMapper";
import midiListenerCallback from "~~/lib/types/midiListenerCallback";

interface ListenersList {
  noteOn: midiListenerCallback[];
  noteOff: midiListenerCallback[];
}

export default class MidiManager implements IManager {
  private listeners: ListenersList = { noteOn: [], noteOff: []};

  private keyPressed: number[] = [];

  private keyboardMap: KeyMapper[] = [
    {key: "KeyQ", midicode: 69, channel: -1},
    {key: "Digit2", midicode: 70, channel: -1},
    {key: "KeyW", midicode: 71, channel: -1},
    {key: "Digit3", midicode: 72, channel: -1},
    {key: "KeyE", midicode: 73, channel: -1},
    {key: "KeyR", midicode: 74, channel: -1},
    {key: "Digit5", midicode: 75, channel: -1},
    {key: "KeyT", midicode: 76, channel: -1},
    {key: "Digit6", midicode: 77, channel: -1},
    {key: "KeyY", midicode: 78, channel: -1},
    {key: "Digit7", midicode: 79, channel: -1},
    {key: "KeyU", midicode: 80, channel: -1}
  ];

  start(): void {
    console.log("Starting the midi manager");
    this.initEvents();
  }

  stop(): void {
    console.log("stopping midi listener");
  }
  onkeydown(callback: midiListenerCallback) {
    this.listeners.noteOn.push(callback);
  }
  
  onkeyup(callback: midiListenerCallback) {
    this.listeners.noteOff.push(callback);
  }

  private initEvents() {
    window.onkeydown = (event: KeyboardEvent) => {
      if (!some(this.keyboardMap, {key: event.code})) return;
  
      const mapper = find(this.keyboardMap, {key: event.code}) as KeyMapper;
      if (mapper.channel !== -1) return;
      const note = mapper.midicode;
  
      this.triggerListeners(this.listeners.noteOn, note, mapper);
    }
  
    window.onkeyup = (event: KeyboardEvent) => {
      const mapper = find(this.keyboardMap, {key: event.code});
      if (mapper === undefined) return;
      const note = mapper.midicode;
  
      if (note === undefined) return;
      pull(this.keyPressed, note);
      this.triggerListeners(this.listeners.noteOff, note, mapper);
    }
  }

  public triggerListeners(list: midiListenerCallback[], pitch: number, mapper: KeyMapper) {
    list.forEach(function(listener: midiListenerCallback) {
      listener(pitch, mapper);
    })
  }
}