<template>
  <div :class="[' module', 'background', { selected }]" @mouseover.stop.prevent="emit('select', module)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Module } from "@jsynple/core"

type Props = {
  selected: boolean
  synthesizer: ScaledCoordinates
  module: Module
}
const props = defineProps<Props>()

type Emits = {
  select: [ Module ]
}
const emit = defineEmits<Emits>()

const width = computed(() => `${20 * props.module.slots}px`)

const height = `${RACK_HEIGHT}px`
</script>

<style scoped>
.module {
  width: v-bind(width);
  height: v-bind(height);
  outline: 2px solid #555555;
  background-color: #777777;
  outline-offset: -2px;
}
.selected {
  outline: 3px solid black;
  outline-offset: -3px;
}
</style>