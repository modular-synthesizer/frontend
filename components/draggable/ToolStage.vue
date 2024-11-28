<template>
  <div
    @mousemove="moveControl"
    @mouseleave.stop.prevent="useControlSelection().reset(tool)"
    @mouseup.stop.prevent="useControlSelection().reset(tool)"
    @click.stop="showCoordinates"
  >
  <svg>
    <g :transform="`scale(${scale} ${scale}) translate(${x} ${y})`">
      <slot></slot>
    </g>
    <g v-if="selection" transform="translate(10 10)">
      <text :class="['fill-grey-lighten-2', 'stroke-grey-lighten-1']">X : {{ selection?.payload.x }}</text>
      <text y="20" :class="['fill-grey-lighten-2', 'stroke-grey-lighten-1']">Y : {{ selection?.payload.y }}</text>
    </g>
  </svg>
</div>
</template>

<script setup lang="ts">
import { IControl } from '~~/lib/interfaces/IControl';
import ITool from '~~/lib/interfaces/ITool';

const { x, y, scale } = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  scale: { type: Number, default: 1 },
  tool: {type: Object as PropType<ITool>, required: true }
});

const selection = computed(() => useControlSelection().selected.value);

function roundBy(value: number, round: number) {
  const v: number = Math.floor(value);
  return value - value % round;
}

function moveControl($event: MouseEvent) {
  const control: IControl|undefined = useControlSelection().selected.value;
  if (control === undefined) return;
  const { ax, ay } = { ax: $event.offsetX, ay: $event.offsetY }
  control.payload.x = roundBy((ax / scale) - x, 5)
  control.payload.y = roundBy((ay / scale) - y, 5)
}

function showCoordinates($event: MouseEvent) {
  const { ax, ay } = { ax: $event.offsetX, ay: $event.offsetY }
    console.log({
      x: Math.floor((ax / scale) - x),
      y: Math.floor((ay / scale) - y),
    })
}
</script>

<style scoped>
svg {
  height: calc(100vh - 140px);
  width: 100%;
}
</style>