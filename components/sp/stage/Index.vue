<!--
This component is a stage where several possible operations can be done :
* drag and drop the whole stage to move it.
* wheel up and down to zoom in and out.
* drag and drop items in it to be able to move them.
-->

<template>
  <svg
    @wheel="onwheel"
    @mousedown="useDraggables().startPanning(name, $event)"
    @mousemove="useDraggables().moveDrag(name, $event)"
    @mouseup="useDraggables().reset(name)"
    @mouseleave="useDraggables().reset(name)"
  >
    <g :transform="`scale(${stage.scale} ${stage.scale})`">
      <g :transform="`translate(${stage.d.x % bgWidth} ${stage.d.y % bgHeight})`">
        <slot name="background" :position="stage.d" :scale="stage.scale"></slot>
      </g>
      <g :transform="`translate(${stage.d.x} ${stage.d.y})`">
        <slot></slot>
      </g>
    </g>
  </svg>
</template>

<script lang="ts" setup>
import { clamp } from 'lodash';
import { ZOOM_RATIO, MAX_ZOOM_OUT, MAX_ZOOM_IN } from '~/lib/utils/constants';
import type { Coordinates, ScaledCoordinates } from '~/types/utils/Coordinates';

const { name, target, dx, dy, bgWidth, bgHeight } = defineProps({
  name: { type: String, required: true },
  target: { type: Object as PropType<ScaledCoordinates>, required: true },
  dx: { type: Number, default: 0 },
  dy: { type: Number, default: 0 },
  bgWidth: { type: Number, default: 1},
  bgHeight: { type: Number, default: 1},
});

console.log(target);

type Emits = { zoomed: [ number ], dragend: [ Coordinates ] };

const emit = defineEmits<Emits>();

function onwheel($event: WheelEvent) {
  const value: number = Math.abs(stage.value.scale + $event.deltaY * -ZOOM_RATIO);
  stage.value.scale = clamp(value, MAX_ZOOM_OUT, MAX_ZOOM_IN);
  emit('zoomed', stage.value.scale)
}

const stage: Ref<Stage> = ref(useDraggables().declare(name, target, { x: dx, y: dy }, target.scale));
stage.value.onmoved = () => emit('dragend', stage.value.d);
</script>