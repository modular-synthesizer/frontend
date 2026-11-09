import type { ObjectId } from "../../../shared/data/ObjectId.type"
import type { BindingKey, Learning } from "../data/Learning.type"
import type { MidiMessage } from "../data/MidiMessage.type"
import { MODWHEEL_CONTROLLER } from "../shared/Constants"

export type ControlTarget = { id: ObjectId, amount: number }

export type ControlTargets = { learning: Learning, targets: ControlTarget[]}

export type ReceiveControlFct = (learning: Learning, message: MidiMessage) => ControlTargets

/**
 * Receives a control message used by the MIDI learn module. A midi control message (MIDI CC) is
 * sent by a standard potentiometer when rotating it. There can be several cases :
 * - A control is pending is the learning structure, then the CC associated with the message is
 *   bound to the control.
 * - there is no pending control in the structure : nothing happens.
 *
 * @param learning the learning structure storing what MIDI CC controls which knob
 * @param message the MIDI CC message sent by the physical real world knob turning.
 * 
 * @returns receives both the learning, modified with the new binding if necessary, and the targets
 * of the parameter modification so that their values can be modified.
 */
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