<template>
  <g @mousedown.prevent.stop="click(target, sx, sy, () => emit('dropped'), $event)" :transform="translate(target)"><slot /></g>
</template>

<script setup lang="ts">
import type { DragDeclaration } from '~/types/draggables/DragDeclaration';
import type { Draggable } from '~/types/utils/Coordinates';
import { translate } from '~/utils/functions/svg';

const { click, sx, sy, target } = defineProps({
  click: { type: Function as PropType<DragDeclaration>, required: true },
  sx: { type: Number, default: 1 },
  sy: { type: Number, default: 1 },
  target: { type: Object as PropType<Draggable>, required: true },
});

type Emits = { dropped: [ ] }

const emit = defineEmits<Emits>();
</script>