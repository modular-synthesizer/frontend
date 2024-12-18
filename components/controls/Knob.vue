<template>
  <knob-wrapper v-if="parameter" :parameter="parameter" :x="x" :y="y" :label="label" :control="control" />
</template>

<script setup lang="ts">
import { ControlsPayload, KnobPayload } from "~~/lib/types/controls";

const { x, y, target, label, mod, control } = defineProps({
  ...KnobPayload, ...ControlsPayload
});

const parameter = computed(() => mod?.parameters[target])
</script>