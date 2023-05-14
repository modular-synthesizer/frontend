import { remove } from "lodash";
import Gate from "../signal/gate";

/**
 * A gates manager provides methods to declares new gates, delete some, and
 * reset the gates list so that no gates are checked. You can also change the
 * duration of the checking interval for performance purpose.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class GatesManager {
  // The interval at which the gates are checked in milliseconds. Make it bigger for better performances.
  private _duration = 5;
  // The list of gates to check. A gate is made to check its input, and trigger an output accordingly.
  private gates: Gate[] = [];

  private interval: number = -1;

  add(gate: Gate) {
    this.gates.push(gate);
  }

  remove(gate: Gate) {
    remove(this.gates, gate);
  }

  public set duration(duration: number) {
    this._duration = duration;
    this.reset();
  }

  private checkGates() {
    this.gates.forEach((gate: Gate) => gate.check());
  }

  /**
   * Resets the internal clock checks with the new duration value.
   */
  public reset() {
    this.stop();
    this.interval = window.setInterval(() => this.checkGates(), this._duration);
  }

  private stop() {
    if (this.interval !== -1) window.clearInterval(this.interval);
    this.interval = -1;
  }
}