<template>
  <g @mousedown.prevent.stop="click(target, sx, sy, $event)" :transform="translate(target)"><slot /></g>
</template>

<script setup lang="ts">
import type { Coordinates } from '~/types/utils/Coordinates';
import type { DragDeclaration } from './strategies/AbstractStrategy';
import { translate } from '~/utils/functions/svg';

const { click, sx, sy, target } = defineProps({
  click: { type: Function as PropType<DragDeclaration>, required: true },
  sx: { type: Number, default: 1 },
  sy: { type: Number, default: 1 },
  target: { type: Object as PropType<Coordinates>, required: true },
});
</script>