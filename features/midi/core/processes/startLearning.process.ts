import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { Learning } from "../data/Learning.type";

export type StartLearningFct = (learning: Learning, target: ObjectId) => Learning

export const startLearning: StartLearningFct = ({ bindings }, target) => {
  return { bindings, pending: target }
}