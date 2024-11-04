<template>
  <circle :cx="x" :cy="y" :r="radius" fill="black" />
  <circle :cx="x" :cy="y" :r="radius + 1" v-if="editing" class="stroke-grey-lighten-2" stroke-width="2" />
  <circle :cx="x" :cy="y" :r="radius + 3" v-if="editing" class="stroke-grey-lighten-1" stroke-width="2" />
</template>

<script setup lang="ts">
/**
 * This component is just the representation of the black background and the graphic
 * representation of the selection of the knob when editing it.
 */
const { x, y, editing } = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  radius: { type: Number, required: true },
  editing: { type: Boolean, default: false },
});
</script>