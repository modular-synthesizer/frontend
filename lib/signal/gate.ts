import Channel from "../wrappers/Channel";

/**
 * A gate holds its last seen value, and compare it to a new value to determine if it should be triggered,
 * released, or if it should not change its state. If triggered or released, it calls the callbacks that
 * have been bound to it at build.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class Gate {
  // The value is initialized as "no tension", so 0V.
  private value: number = 0;
  // The channel is used to get the analyser to get the value for the last sample.
  private analyser: AnalyserNode;
  // The buffer used to contain the last read value for the analyser datas.
  private buffer: Float32Array = new Float32Array(1);
  // The functions used when the gate is triggered.
  private triggerCallbacks: Function[] = [];
  // The functions called when the gate is released.
  private releaseCallbacks: Function[] = [];

  constructor(channel: Channel, nodekey: string) {
    this.analyser = channel.getNode(nodekey)?.node as AnalyserNode;
  }

  /**
   * Get the last value in the analyser node buffer and compares it with the currently owned value.
   * If the new value is higher, it means that it was 0 and now it's 1, so we trigger the gate.
   * If the new value is lower, it means it's 0 and it was 1, so we release the gate processors.
   */
  public check() {
    this.analyser.getFloatTimeDomainData(this.buffer);
    const newValue = this.buffer[0]
    if (newValue > this.value) {
      this.triggerCallbacks.forEach(callback => callback());
    }
    else if (newValue < this.value) {
      this.releaseCallbacks.forEach(callback => callback());
    }
    this.value = newValue;
  }

  public onTrigger(callback: Function) {
    this.triggerCallbacks.push(callback);
  }

  public onRelease(callback: Function) {
    this.releaseCallbacks.push(callback);
  }

  public setValue(value: number) {
    this.value = value;
  }
}