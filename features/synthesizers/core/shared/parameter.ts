import { assertNever } from "../../../shared/facts";
import type { Parameter, ParameterChange, ParameterDragChange, ParameterMidiChange, ParameterWheelChange } from "../data/Parameter.type";
import { PIXELS_PER_UNIT, SHIFT_RATIO_UPGRADE } from "./Constants";
import type { Diff } from "./rack";

export type ClampValueFct = (parameter: Parameter, value: number) => number

export const clampValue: ClampValueFct = (parameter, value) =>
  Math.min(Math.max(parameter.minimum, value), parameter.maximum)

export type TargetValueFct = (parameter: Parameter, change: ParameterChange) => number

export const targetValue: TargetValueFct = (parameter, change) => {
  switch (change.kind) {
    case "drag":
      return dragToValue(parameter, change)
    case "midi":
      return midiToValue(parameter, change)
    case "reset":
      return parameter.default
    case "wheel":
      return wheelToValue(parameter, change)
    default:
      return assertNever(change)
  }
}

export const valuesDiffer: Diff<number> = (first, second) => (first !== second)

type ChangeConverter<C extends ParameterChange> = (parameter: Parameter, change: C) => number

const dragToValue: ChangeConverter<ParameterDragChange> = ({ value, step }, { pixels }) => {
  return value + (Math.round(pixels / PIXELS_PER_UNIT) * step)
}

const midiToValue: ChangeConverter<ParameterMidiChange> = ({ minimum, maximum, step }, { amount }): number => {
  const delta = maximum - minimum
  const deltaAmount = delta * (amount / 127)
  return roundValue(minimum + deltaAmount, step)
}

const wheelToValue: ChangeConverter<ParameterWheelChange> = ({ value, step }, { deltaY, shift }) => {
  return (value + Math.sign(-deltaY) * step * (shift ? SHIFT_RATIO_UPGRADE : 1))
}

const roundValue: (value: number, round?: number) => number = (value, round = 1) => {
  return Math.round(value / round) * round
}