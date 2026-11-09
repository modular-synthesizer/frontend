<template>
  <g></g>
</template>

<script lang="ts" setup>

import type { AudioModule } from "~/types/modules/AudioModule"
import type { Control } from "~/types/Index"
import type { MidiMessage } from "~/features/midi/core/data/MidiMessage.type"
import { makeMidiController, toVoicePorts, type MidiControl } from "~/features/synthesizers/shell/legacy/midiController.adapter"
import { MIDI_HUB } from "~/features/synthesizers/shared/Constants";

const props = defineProps({
  control: { type: Object as PropType<Control>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
})

const hub = inject(MIDI_HUB)
const ports = toVoicePorts(props.module, props.control.payload, useAudio().context)

let control: MidiControl | null = null

const build = (): void => {
  const result = makeMidiController(ports, props.module, props.control.payload)
  if (!result.ok) console.warn(`MIDI control of module ${props.module.id} disabled: ${result.error()}`)
  control = result.orNull()
}

const releaseAll = (): void => { void control?.releaseAll() }
const receive = (message: MidiMessage): void => { void control?.receive(message) }

build()

let unlisten = (): void => {}
onMounted(() => {
  if (hub) unlisten = hub.listen(receive)
  else console.warn(`MIDI control of module ${props.module.id}: no MIDI hub provided`)
})
onBeforeUnmount(() => {
  unlisten()
  releaseAll()
})

watch(() => props.module.parameters.channel?.value, releaseAll)
watch(() => props.module.parameters[String(props.control.payload.voices)]?.value, () => {
  releaseAll()
  build()
})
</script>