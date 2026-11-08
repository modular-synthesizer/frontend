import type { ObjectId } from "../../../shared/data/ObjectId.type"
import type { BindingKey, Learning } from "../data/Learning.type"
import type { MidiMessage } from "../data/MidiMessage.type"
import { MODWHEEL_CONTROLLER } from "../shared/Constants"

export type ControlTarget = { id: ObjectId, amount: number }

export type ControlTargets = { learning: Learning, targets: ControlTarget[]}

export type ReceiveControlFct = (learning: Learning, message: MidiMessage) => ControlTargets

export const receiveControl: ReceiveControlFct = (learning, message) => {
  if (message.kind !== "control" || message.controller === MODWHEEL_CONTROLLER) {
    return { learning, targets: [] }
  }
  const { bindings, pending } = learning
  const key: BindingKey = `${message.channel}:${message.controller}`
  const current = bindings[key] ?? []
  const ids = pending === null || current.includes(pending) ? current : [ ...current, pending ]

  return {
    learning: { bindings: ids.length ? { ...bindings, [key]: ids } : bindings, pending: null },
    targets: ids.map(id => ({ id, amount: message.value }))
  }
}