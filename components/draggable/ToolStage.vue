<template>
  <div
    @mousemove="moveControl"
    @mouseleave.stop.prevent="useControlSelection().reset()"
    @mouseup.stop.prevent="useControlSelection().reset()"
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

const { x, y, scale } = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  scale: { type: Number, default: 1 },
});

const selection = computed(() => useControlSelection().selected.value);

function moveControl() {
  const control: IControl|undefined = useControlSelection().selected.value;
  if (control === undefined) return;
}
</script>

<style scoped>
svg {
  height: calc(100vh - 140px);
  width: 100%;
}
</style>