<template>
  <circle :cx="control.payload.x" :cy="control.payload.y" :r="10" fill="white" @mousedown.stop="onmousedown" />
</template>

<script setup lang="ts">
import type { DragDeclaration } from '~/types/draggables/DragDeclaration';
import type { Control } from '~/types/tools/Control';
import { ParamStrategy } from '~/utils/draggables/ParamStrategy';

const { click, control } = defineProps({
  control: { type: Object as PropType<Control>, required: true },
  click: { type: Function as PropType<DragDeclaration>, required: true }
});

function onmousedown($event: MouseEvent) {
  click(new ParamStrategy(control), $event);
}
</script>