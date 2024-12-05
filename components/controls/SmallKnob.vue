<template>
  <knob-wrapper :x="x" :y="y" v-if="parameter" :parameter="parameter" :r="14" :label="label" :control="control" v-slot="{ value }" :small="true">
    {{ isMidi ? midiLabel(value): value }}
  </knob-wrapper>
</template>

<script setup lang="ts">
import { ControlsPayload, KnobPayload } from "~~/lib/types/controls";

const { x, y, target, label, mod, control, midi } = defineProps({
  ...KnobPayload, ...ControlsPayload,
  midi: { type: String, default: 'false' },
});

const isMidi = midi === 'true';

function midiLabel(value: number): String {
  return value === -1 ? 'KBD' : `${value + 1}`;
}

const parameter = computed(() => mod?.param(target))
</script>