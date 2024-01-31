<template>
<svg
    @mousedown.left.stop="dragStart(position, $event)"
    @mousedown.right.stop="hide"
    @mouseup.left.stop="endDrag"
    @mouseleave="endDrag"
    @wheel.passive.prevent.stop="setScale(position, $event); emit('wheel')"
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
  emit('dragend')
}
</script>