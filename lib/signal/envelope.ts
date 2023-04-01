import Channel from "../wrappers/Channel";

/**
 * An enveloppe is a volume operator allowing more natural feeling notes when playing the keyboard.
 * This one is an ADSR envelope, using four parameters (attack, decay, sustain, release).
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class Envelope {
  // The channel is used to get the node when triggering or releasing the envelope.
  private channel: Channel;
  // The target is the name of the node in the channel used to trigger or release the volume.
  private target: string;

  constructor(channel: Channel, target: string) {
    this.channel = channel;
    this.target= target;
  }

  /**
   * Triggers the first three phases of the ADSR one after the other : attack, then decay, then
   * keeps the sustain volume level as long as the note is note released.
   * 
   * @param a the duration of the attack in milliseconds (converted in seconds).
   * @param d the duration of the decay in milliseconds (converted in seconds).
   * @param s the level of sustain in percents of the maximum volume.
   */
  trigger(a: number, d: number, s: number) {
    this.param.cancelAndHoldAtTime(this.t);
    this.param.setTargetAtTime(1, this.t, a / 1000)
    this.param.setTargetAtTime(s / 100, this.t,  (a + d) / 1000)
  }
  
  /**
   * Triggers the release phase of the ADSR, putting the volume back to 0.
   * @param r the release time, in milliseconds (converted in seconds).
   */
  release(r: number) {
    this.param.cancelAndHoldAtTime(this.t);
    this.param.setTargetAtTime(0, this.t, r / 1000)
  }

  private get param(): AudioParam {
    return (this.channel.getNode(this.target)?.node as GainNode).gain;
  }

  private get t(): number {
    return useAudioContext().context?.currentTime || 0;
  }
}