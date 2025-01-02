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
      <slot name="background"></slot>
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

const { name, target, dx, dy } = defineProps({
  name: { type: String, required: true },
  target: { type: Object as PropType<ScaledCoordinates>, required: true },
  dx: { type: Number, default: 0 },
  dy: { type: Number, default: 0 },
});

type Emits = { zoomed: [ number ], dragend: [ Coordinates ] };

const emit = defineEmits<Emits>();

function onwheel($event: WheelEvent) {
  const value: number = Math.abs(stage.scale + $event.deltaY * -ZOOM_RATIO);
  stage.scale = clamp(value, MAX_ZOOM_OUT, MAX_ZOOM_IN);
  emit('zoomed', stage.scale)
}

const stage: Stage = useDraggables().declare(name, target, { x: dx, y: dy });
stage.callback = () => emit('dragend', stage.d);
</script>