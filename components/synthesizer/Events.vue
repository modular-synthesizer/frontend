<template>
<svg
    @mousedown.left.stop="dragStart($event)"
    @mousedown.right.stop="hide"
    @mousemove="dragMove(position, $event)"
    @mouseup.left.stop="endDrag"
    @mouseleave="dragEnd(); emit('dragend')"
    @wheel.passive="setScale(position, $event); emit('wheel')"
    @click.right.stop.prevent="displayContext"
  >
    <g :transform="`translate(${position.x} ${position.y}) scale(${position.scale} ${position.scale})`">
      <slot></slot>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { ScalablePosition } from '~~/lib/types/ScalablePosition';

const { position } = defineProps<{position: ScalablePosition}>();
const emit = defineEmits(['wheel', 'dragend']);

function endDrag() {
  dragEnd();
  console.log("emitting dragend");
  emit('dragend')
}
</script>