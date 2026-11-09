import type { MidiLearn } from "~/features/synthesizers/shell/legacy/midiLearn.adapter"
import { makeMidiLearn } from "~/features/synthesizers/shell/legacy/midiLearn.adapter"
import { editParameterDebounced } from "~/features/synthesizers/shell/legacy/parameter.adapter"

export type UseMidiLearnFct = () => MidiLearn

const midiLearn = makeMidiLearn(editParameterDebounced)

export const useMidiLearn: UseMidiLearnFct = () => ({
  ...midiLearn,
  learn: parameter => {
    useContexts().hide()
    midiLearn.learn(parameter)
  },
})