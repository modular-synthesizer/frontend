<template>
  <g @mousedown.capture.stop.prevent="useDraggables().startDrag(stage, name, $event)" :transform="`translate(${target.x} ${target.y})`">
    <slot></slot>
  </g>
</template>

<script lang="ts" setup>
import type { Coordinates } from '~/types/utils/Coordinates';

type CollisionFunction = (c: Coordinates) => Boolean

const { collision, stage, name, sx, sy, target } = defineProps({
  stage: { type: String, required: true },
  name: { type: String, required: true },
  target: { type: Object as PropType<Coordinates>, required: true },
  sx: { type: Number, default: 1 },
  sy: { type: Number, default: 1 },
  collision: {type: Function as PropType<CollisionFunction>, default: (_: Coordinates) => false},
});

type Emits = { dragend: [ Coordinates ] };

const emit = defineEmits<Emits>();

const draggable: Draggable = useDraggables().addDraggable(stage, name, target, { sx, sy, collision });
draggable.callback = () => emit("dragend", draggable.item);
</script>