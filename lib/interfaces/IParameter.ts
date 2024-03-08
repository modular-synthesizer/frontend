import { WatcherCallback } from "../types/Parameters";
import { IControl } from "./IControl";

/**
 * This represents a parameter accessible on a module, that can be modified by a control.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default interface IParameter {
  // The unique identifier as an object UUID of the parameter in the database.
  id: string;
  // The name of the parameter, used to target it with controls.
  name: string;
  // The current value of the parameter as a number bounded between min and max.
  value: number;
  // The minimum value the value of the parameter must have to be valid
  minimum: number;
  // The upper boundary for the value of the parameter.
  maximum: number;
  // The steps some controls should be modifying the parameter by.
  step: number;
  // The number of decimal digits the controls should be displaying for this parameter.
  precision: number;
  // The name of the InnerNode's this parameter is targetting.
  targets: string[];
  // The name of the AudioParam this parameter is targetting. Modifying its value will set it.
  field: string;

  /**
   * Sets the value of the parameter, and the inner nodes AudioParams linked to the parameter.
   * @param {number} value the value to set the parameter with.
   */
  setValue(value: number): void;

  /**
   * Moves the value from the given amount, relative to the current value of the parameter.
   * @param {number} delta the amount with which the value will be moved.
   */
  moveValue(delta: number): void;

  /**
   * Watches the value changes by declaring callbacks that should be called when the value is modified.
   * @param {WatcherCallback} callback the function to call when the value is modified.
   */
  watch(callback: WatcherCallback): void;

  /**
   * Gets the audio parameter described by the current synth parameter in an audio node.
   * @param node the audio node to search into.
   * @return {AudioParam|undefined} the audio parameter if it exists, undefined otherwise.
   */
  audioParam(node: AudioNode): AudioParam|undefined;

  /**
   * Returns the list of controls being able to modify the value of this parameter.
   * @return {IControl[]} an array of controls being able to modify the value of the current parameter.
   */
  get controls(): IControl[];
}