<template>
  <g @mousedown.prevent.stop="onmousedown" :transform="translate(target)"><slot /></g>
</template>

<script setup lang="ts">
import type { DragDeclaration } from '~/types/draggables/DragDeclaration';
import type { Draggable } from '~/types/utils/Coordinates';
import { DragStrategy } from '~/utils/draggables/DragStrategy';
import { translate } from '~/utils/functions/svg';

const { click, scale, sx, sy, target } = defineProps({
  click: { type: Function as PropType<DragDeclaration>, required: true },
  sx: { type: Number, default: 1 },
  sy: { type: Number, default: 1 },
  scale: { type: Number, default: 1.0 },
  target: { type: Object as PropType<Draggable>, required: true },
});

type Emits = { dropped: [ ], moved: [ Draggable ] }

const emit = defineEmits<Emits>();

function onmousedown($event: MouseEvent) {
  const callbacks: Record<string, () => void> = {
    dropped: () => emit('dropped'),
    moved: () => emit('moved', target),
  }
  click(new DragStrategy(target, scale, sx, sy, callbacks), $event)
}
</script>