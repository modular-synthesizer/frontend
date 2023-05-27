import { remove } from "lodash";
import Gate from "../signal/gate";
import IManager from "../interfaces/IManager";

/**
 * A gates manager provides methods to declares new gates, delete some, and
 * reset the gates list so that no gates are checked. You can also change the
 * duration of the checking interval for performance purpose.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class GatesManager implements IManager {
  // The interval at which the gates are checked in milliseconds. Make it bigger for better performances.
  private _duration = 5;
  // The list of gates to check. A gate is made to check its input, and trigger an output accordingly.
  private gates: Gate[] = [];
  // Holds the result of the setInterval method for when we want to stop checking the gates.
  private interval: number = -1;

  add(gate: Gate) {
    this.gates.push(gate);
  }

  remove(gate: Gate) {
    remove(this.gates, gate);
  }

  /**
   * When setting the duration, we make sure we restart the interval with the new one for it to be used properly.
   * @param duration the duration between each check in milliseconds.
   */
  public set duration(duration: number) {
    this._duration = duration;
    this.start();
  }

  private checkGates() {
    this.gates.forEach((gate: Gate) => gate.check());
  }

  /**
   * Resets the internal clock checks with the new duration value.
   */
  public start() {
    this.stop();
    this.interval = window.setInterval(() => this.checkGates(), this._duration);
  }

  public stop() {
    if (this.interval !== -1) window.clearInterval(this.interval);
    this.interval = -1;
  }
}