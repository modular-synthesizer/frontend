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

  public message(kind: number, payload: number) {
    switch (kind) {
      case 144:
        this.noteOn(payload);
        break;
      case 128:
        this.noteOff(payload);
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

  private getFreePolyphonyChannel(): number {
    return findIndex(this.channels, ch => ch === -1);
  }

  private getChannelForNote(note: number): number {
    return findIndex(this.channels, ch => ch === note);
  }
}