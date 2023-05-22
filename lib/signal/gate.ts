import { eventbus } from "../utils/eventbus/EventBus";
import Channel from "../wrappers/Channel";
import Mod from "../wrappers/Mod";

/**
 * A gate holds its last seen value, and compare it to a new value to determine if it should be triggered,
 * released, or if it should not change its state. If triggered or released, it calls the callbacks that
 * have been bound to it at build.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class Gate {
  private mod: Mod;
  // The channel is used to get the analyser to get the value for the last sample.
  private analyser: AnalyserNode;
  // The buffer used to contain the last read value for the analyser datas.
  private buffer: Float32Array = new Float32Array(1);
  // Current state of the gate, TRUE if gate is opened, FALSE otherwise.
  private triggered: boolean = false;

  private channel: Channel;

  constructor(mod: Mod, channel: Channel, nodekey: string) {
    this.analyser = channel.getNode(nodekey)?.node as AnalyserNode;
    this.mod = mod;
    this.channel = channel;
  }

  /**
   * Get the last value in the analyser node buffer and compares it with the currently owned value.
   * If the new value is higher, it means that it was 0 and now it's 1, so we trigger the gate.
   * If the new value is lower, it means it's 0 and it was 1, so we release the gate processors.
   */
  public check() {
    this.analyser.getFloatTimeDomainData(this.buffer);
    if (!this.triggered && this.buffer[0] >= 1) {
      eventbus.emit(`gates/trigger/${this.mod.id}/${this.channel.index}`);
      this.triggered = true;
    }
    else if (this.buffer[0] < 1 && this.triggered) {
      eventbus.emit(`gates/release/${this.mod.id}/${this.channel.index}`);
      this.triggered = false;
    }
  }

  public onTrigger(callback: Function) {
    eventbus.subscribe(`gates/trigger/${this.mod.id}/${this.channel.index}`, callback);
  }

  public onRelease(callback: Function) {
    eventbus.subscribe(`gates/release/${this.mod.id}/${this.channel.index}`, callback);
  }
}