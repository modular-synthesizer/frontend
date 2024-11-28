<template>
    <g :transform="`scale(${scale} ${scale}) translate(${x} ${y})`">
      <slot></slot>
    </g>
</template>

<script setup lang="ts">
const { x, y, scale } = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  scale: { type: Number, default: 1 },
})
</script>