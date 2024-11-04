<template>
  <knob-wrapper :x="x" :y="y" :parameter=mod.param(target) :r="14" :label="label" :control="control" v-slot="{ value }" :small="true">
    {{ isMidi ? midiLabel(value): value }}
  </knob-wrapper>
</template>

<script setup lang="ts">
import { IControl } from "~~/lib/interfaces/IControl";
import Mod from "~~/lib/wrappers/Mod";

const { x, y, target, label, mod, control, midi } = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  target: { type: String, required: true },
  label: { type: String, default: "" },
  mod: { type: Mod, required: true },
  control: { type: Object as PropType<IControl>, required: true },
  midi: { type: String, default: 'false' },
});

const isMidi = midi === 'true';

function midiLabel(value: number): String {
  return value === -1 ? 'KBD' : `${value + 1}`;
}
</script>