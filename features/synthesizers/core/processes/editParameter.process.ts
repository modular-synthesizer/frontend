import type { SynthesizersEffect } from "../data/Effect.type";
import type { Parameter, ParameterChange } from "../data/Parameter.type";
import { clampValue, targetValue, valuesDiffer } from "../shared/parameter";

export type PreviewParameterFct = (parameter: Parameter, change: ParameterChange) => number

export const previewParameter: PreviewParameterFct = (parameter, change) =>
  clampValue(parameter, targetValue(parameter, change))

export type EditParameterFct = (parameter: Parameter, change: ParameterChange, t: number) =>
  { value: number, effects: SynthesizersEffect[] }

export const editParameter: EditParameterFct = (parameter, change, t) => {
  const value = previewParameter(parameter, change)
  if (parameter.moduleId === null) return { value, effects: [] }
  if (!valuesDiffer(value, parameter.value)) return { value, effects: [] }
  const effect: SynthesizersEffect = {
    type: "synthesizers.parameter.save", id: parameter.id, moduleId: parameter.moduleId, value, t
  }
  return { value, effects: [ effect ]}
}
