import type { MidiMessage } from "../../../midi/core/data/MidiMessage.type"
import type { Parameter as LegacyParameter } from "~/types/modules/Parameter"
import type { EditParameterAdapter } from "./parameter.adapter"
import { toObjectId, type ObjectId } from "../../../shared/data/ObjectId.type"
import type { Learning } from "../../../midi/core/data/Learning.type"
import { startLearning } from "../../../midi/core/processes/startLearning.process"
import { unlearn as unlearnProcess } from "../../../midi/core/processes/unlearn.process"
import { receiveControl } from "../../../midi/core/processes/receiveControl.process"

export type MidiLearn = {
  learn: (parameter: LegacyParameter) => void
  unlearn: (parameter: LegacyParameter) => void
  receive: (message: MidiMessage) => Promise<void>
  reset: () => void
}
export type MidiLearnFactory = (edit: EditParameterAdapter) => MidiLearn

const NOTHING_LEARNED: Learning = { pending: null, bindings: {} }

export const makeMidiLearn: MidiLearnFactory = edit => {
  let learning: Learning = NOTHING_LEARNED
  const registry = new Map<ObjectId, LegacyParameter>()

  const learn = (parameter: LegacyParameter): void => {
    const id = toObjectId(parameter.id)
    registry.set(id, parameter)
    learning = startLearning(learning, id)
  }

  const unlearn = (parameter: LegacyParameter): void => {
    const id = toObjectId(parameter.id)
    learning = unlearnProcess(learning, id)
    registry.delete(id)
  }

  const receive = async (message: MidiMessage): Promise<void> => {
    const { learning: next, targets } = receiveControl(learning, message)
    learning = next
    await Promise.all(targets.map(({ id, amount }) => {
      const parameter = registry.get(id)
      if (parameter === undefined || parameter.mod.deleted) return
      return edit(parameter, { kind: "midi", amount })
    }))
  }

  const reset = (): void => {
    learning = NOTHING_LEARNED
    registry.clear()
  }

  return { learn, unlearn, receive, reset }
}
