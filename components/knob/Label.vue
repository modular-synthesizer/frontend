<template>
  <text
    :transform="`translate(${x}, ${y})`"
    text-anchor="middle"
    class="label-text fill-shades-black stroke-grey-darken-1"
  >
    {{ label }}
  </text>
</template>

<script setup lang="ts">
/**
 * This component represents the text above a knob in the modules. It's often the abbreviation
 * of the field that is controled by the knob. It has no events as it's not interactive.
 */
const { x, y, label } = defineProps({
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0},
    label: { type: String, required: true },
});
</script>

<style scoped>
.label-text {
  font-size: 10px;
  user-select: none;
  paint-order: stroke;
}
</style>