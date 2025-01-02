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
    <slot name="background"></slot>
    <g :transform="`translate(${stage.d.x} ${stage.d.y}) scale(${stage.scale} ${stage.scale})`">
      <slot></slot>
    </g>
  </svg>
</template>

<script lang="ts" setup>
import { clamp } from 'lodash';
import { ZOOM_RATIO, MAX_ZOOM_OUT, MAX_ZOOM_IN } from '~/lib/utils/constants';

const { name } = defineProps({
  name: { type: String, required: true },
});

const stage: ComputedRef<Stage> = computed(() => {
  return useDraggables().getStage(name);
})

function onwheel($event: WheelEvent) {
  const value: number = Math.abs(stage.value.scale + $event.deltaY * -ZOOM_RATIO);
  const scale: number = clamp(value, MAX_ZOOM_OUT, MAX_ZOOM_IN);
  useDraggables().setScale('tool-structure', scale);
}
</script>