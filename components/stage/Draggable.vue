<template>
  <g @mousedown.prevent.stop="click(target, sx, sy, $event)"><slot /></g>
</template>

<script setup lang="ts">
import type { Coordinates } from '~/types/utils/Coordinates';
import type { DragDeclaration } from './strategies/AbstractStrategy';

const { click } = defineProps({
  click: { type: Function as PropType<DragDeclaration>, required: true },
  sx: { type: Number, default: 1 },
  sy: { type: Number, default: 1 },
  target: { type: Object as PropType<Coordinates>, required: true },
});
</script>