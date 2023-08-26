import { difference, findIndex, indexOf, last } from "lodash";
import { POLYPHONY_CHANNELS } from "../utils/constants";
import { eventbus } from "../utils/eventbus/EventBus";
import ISynthesizer from "../interfaces/ISynthesizer";
import Synthesizer from "../wrappers/Synthesizer";
import { v4 as uuid } from "uuid";

export default class MidiDevice {

  private midichannel: number;

  private pressed: number[] = []

  private id: string;

  // All polyphony channels are marked as empty at first, signaled by -1
  private channels = Array.from(Array(POLYPHONY_CHANNELS)).map(_ => -1);

  constructor(midichannel: number) {
    this.midichannel = midichannel;
    this.id = uuid();
  }

  public setSynthesizer(synthesizer: Synthesizer|ISynthesizer) {
    if (synthesizer.voices > this.channels.length) {
      const newArray = Array.from(Array(synthesizer.voices - this.channels.length)).map(_ => -1);
      this.channels = [...this.channels, ...newArray];
    }
    else if (synthesizer.voices < this.channels.length) {
      this.channels = this.channels.slice(0, synthesizer.voices);
    }
  }

  public message(kind: number, payload: Uint8Array) {
    switch (kind) {
      case 144:
        this.noteOn(payload[1]);
        break;
      case 128:
        this.noteOff(payload[1]);
        break;
      case 176:
        this.controlChange(payload);
        break;
    }
  }

  public noteOn(note: number) {
    // The key is already being pressed, nothing more to do.
    if (indexOf(this.pressed, note) >= 0) return;
    this.pressed.push(note);
    let channel = this.getFreePolyphonyChannel();

    if (channel === -1) {
      channel = this.channels.length - 1;
      eventbus.emit(`midi/note-change/${this.midichannel}`, { note, channel })
    }
    else {
      eventbus.emit(`midi/trigger/${this.midichannel}`, { note, channel });
    }
    this.channels[channel] = note;
  }

  public noteOff(note: number) {
    this.pressed = this.pressed.filter(k => k !== note);
    const channel = this.getChannelForNote(note);
    if (channel === -1) return;

    const diff = difference(this.pressed, this.channels);
    this.channels[channel] = (diff.length ? last(diff) : -1) || -1;

    if (this.channels[channel] === -1) {
      eventbus.emit(`midi/release/${this.midichannel}`, { note, channel });
    }
    else {
      eventbus.emit(`midi/note-change/${this.midichannel}`, {
        note: this.channels[channel], channel
      })
    }
    
  }

  public controlChange(payload: Uint8Array) {
    const type: number = payload[1];
    switch(type) {
      case 1:
        this.modWheel(payload[2] / 12.7);
        break;
    }
  }

  public modWheel(amount: number) {
    eventbus.emit(`midi/modwheel/${this.midichannel}`, { amount });
  }

  public terminate() {
    this.pressed.forEach((p: number) => {
      this.noteOff(p);
    })
    this.pressed = []
    this.channels = Array.from(Array(POLYPHONY_CHANNELS)).map(i => -1);
  }

  private getFreePolyphonyChannel(): number {
    if (this.channels.length === 1) return 0;
    return findIndex(this.channels, ch => ch === -1);
  }

  private getChannelForNote(note: number): number {
    return findIndex(this.channels, ch => ch === note);
  }
}