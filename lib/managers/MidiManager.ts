import IManager from "~~/lib/interfaces/IManager";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import MidiDevice from "~~/lib/midi/MidiDevice";
import ISynthesizer from "../interfaces/ISynthesizer";
import Synthesizer from "../wrappers/Synthesizer";

/**
 * This class manages the connection of MIDI devices to the event bus and the emission of "noteOn" and "noteOff"
 * messages when stroking and releasing keys on a MIDI keyboard for example. The device itself manages what each
 * message is supposed to do, this class just "binds" the events to it and allow the circulation of messages.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class MidiManager implements IManager {

  // The list of MIDI devices currently connected to the application. This is updated when a new device is plugged.
  private devices: MidiDevice[] = [];

  /**
   * This is called when displaying a new synthesizer as this manager is started just like the others. This iterates
   * through the MIDI inputs and creates the callback sent when a message is received on it. It furthermore listens
   * to the connection of new MIDI devices to bind the callback to it too.
   */
  start(): void {
    navigator.requestMIDIAccess().then((access: MIDIAccess) => {
      for (let input of access.inputs.values()) {
         this.bindEvents(input);
      }
      access.onstatechange = (event: Event) => {
        this.handleNewDevice(event);
      }
    })
  }

  public setSynthesizer(synth: Synthesizer|ISynthesizer) {
    this.devices.forEach((device: MidiDevice) => {
      device.setSynthesizer(synth);
    });
  }

  /**
   * The stop event first terminates all the MIDI devices, unlinking them from the event bus, then resets the entire
   * list and destroys the whole MIDI topic on the event bus to avoid further messages transmission.
   */
  stop(): void {
    this.devices.forEach((d: MidiDevice) => d.terminate());
    this.devices = [];
    eventbus.destroy('midi');
  }

  /**
   * BInds a callback called when receiving a MIDI message on the designated device. The message is parsed, and its
   * data transmitted entirely to the MIDIDevice class to be handled and analyzed.
   * @param input the MIDI device to bind the events to.
   */
  public bindEvents(input: MIDIInput) {
    input.onmidimessage = (message: Event): any => {
      if (!(message instanceof MIDIMessageEvent)) return;
      const channel = message.data[0] % 16;
      const device: MidiDevice = this.getOrCreateDevice(channel);
      device.message(message.data[0] - channel, message.data);
    }
  }

  /**
   * Returns the device attached to a MIDI channel, after creating it if it does not exist already.
   * @param midichannel The number (from 1 to 16) of the MIDI channel to create or get.
   */
  private getOrCreateDevice(midichannel: number) {
    if (this.devices[midichannel] === undefined) {
      this.devices[midichannel] = new MidiDevice(midichannel);
    }
    return this.devices[midichannel];
  }

  /**
   * Checks if the event corresponds to a "new device connected" event by checking its internal state, and if it's the
   * case initializes all the events for the new device to allow for a "plug and play" logic.
   * @param event The connection event containing informations about the new device.
   */
  private handleNewDevice(event: Event) {
    if (event instanceof MIDIConnectionEvent) {
      if (event.port instanceof MIDIInput && event.port.state === 'connected') {
        this.bindEvents(event.port);
      }
    }
  }
}