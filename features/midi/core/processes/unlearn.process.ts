import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { BindingKey, Bindings, Learning } from "../data/Learning.type";

export type UnlearnFct = (learning: Learning, target: ObjectId) => Learning

export const unlearn: UnlearnFct = ({ bindings, pending }, target) => {
  const newBindings: Bindings = {}
  const entries = Object.entries(bindings)
  for (const [ key, values ] of entries) {
    const newArray = values.filter(id => id !== target)
    if (newArray.length) newBindings[key as BindingKey] = newArray
  }
  return {
    bindings: newBindings,
    pending: pending === target ? null : pending
  }
}
