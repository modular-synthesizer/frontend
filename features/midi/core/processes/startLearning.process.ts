import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { Learning } from "../data/Learning.type";

export type StartLearningFct = (learning: Learning, target: ObjectId) => Learning

/**
 * Put the given target as "ready to learn" when selecting it in the corresponding
 * learning environment. The next MIDI CC message will then select it as the new
 * controlled knob for the corresponding CC.
 * 
 * @param learning the current learning environment. 
 * @param target the ObjectId of the knob you want to physically control.
 * 
 * @returns the new learning environment, with the target as pending.
 */
export const startLearning: StartLearningFct = ({ bindings }, target) => {
  return { bindings, pending: target }
}