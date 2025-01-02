<template>
  <g @mousedown.capture.stop.prevent="useDraggables().startDrag(stage, name, $event)" :transform="`translate(${target.x} ${target.y})`">
    <slot></slot>
  </g>
</template>

<script lang="ts" setup>
import type { Coordinates } from '~/types/utils/Coordinates';

const { stage, name, sx, sy, target } = defineProps({
  stage: { type: String, required: true },
  name: { type: String, required: true },
  target: { type: Object as PropType<Coordinates>, required: true },
    sx: { type: Number, default: 1 },
    sy: { type: Number, default: 1 },
});

useDraggables().addDraggable(stage, name, target, { sx, sy });
</script>