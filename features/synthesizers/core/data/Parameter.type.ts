import type { ObjectId } from "../../../shared/data/ObjectId.type"

export type Parameter = {
  id: ObjectId
  moduleId: ObjectId | null
  value: number
  default: number
  minimum: number
  maximum: number
  step: number
}

export type ParameterDragChange =  { kind: "drag", pixels: number }

export type ParameterWheelChange = { kind: "wheel", deltaY: number, shift: boolean }

export type ParameterMidiChange = { kind: "midi", amount: number }

export type ParameterReset = { kind: "reset" }

export type ParameterChange =
  | ParameterDragChange
  | ParameterWheelChange
  | ParameterMidiChange
  | ParameterReset