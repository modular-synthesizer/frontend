import { findIndex, indexOf } from "lodash";
import { POLYPHONY_CHANNELS } from "../utils/constants";
import { eventbus } from "../utils/eventbus/EventBus";

export default class MidiDevice {

  private midichannel: number;

  private pressed: number[] = []

  // All polyphony channels are marked as empty at first, signaled by -1
  private channels = Array.from(Array(POLYPHONY_CHANNELS)).map(i => -1);

  constructor(midichannel: number) {
    this.midichannel = midichannel;
  }

  public message(kind: number, payload: Uint32Array) {
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
    const channel = this.getFreePolyphonyChannel();
    this.channels[channel] = note;
    this.pressed.push(note);
    eventbus.emit(`midi/trigger/${this.midichannel}`, { note, channel });
  }

  public noteOff(note: number) {
    const channel = this.getChannelForNote(note);
    this.channels[channel] = -1;
    this.pressed = this.pressed.filter(k => k !== note);
    eventbus.emit(`midi/release/${this.midichannel}`, { note, channel });
  }

  public controlChange(payload: Uint32Array) {
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
  }

  private getFreePolyphonyChannel(): number {
    return findIndex(this.channels, ch => ch === -1);
  }

  private getChannelForNote(note: number): number {
    return findIndex(this.channels, ch => ch === note);
  }
}