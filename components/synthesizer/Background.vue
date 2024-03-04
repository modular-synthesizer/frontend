<template>
  <g>
    <text x="20" y="300">origin: [{{ origin().x }};{{ origin().y }}] - {{ position.scale }}</text>
    <text x="20" y="320">position : [{{ position.x }};{{ position.y }}]</text>
    <text x="20" y="340">sizes : [{{ SLOT_SIZE }};{{ RACK_HEIGHT }}]</text>
    <text x="20" y="360">slots/racks : [{{ nbSlots() }};{{ nbRacks() }}]</text>
  </g>
  <g :transform="`translate(${origin().x} ${origin().y}) scale(${position.scale} ${position.scale})`">
    <template v-for="r in nbRacks()">
      <rect
        v-for="i in nbSlots()"
        :width="SLOT_SIZE"
        :height="SLOT_SIZE"
        fill="white"
        stroke="black"
        :x="(i-2) * SLOT_SIZE"
        :y="(r-2) * RACK_HEIGHT"
      />
    </template>
  </g>
</template>

<script setup lang="ts">
import { ScalablePosition } from '~~/lib/types/ScalablePosition';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';

type Dimensions = { width: number, height: number }

const { position } = defineProps<{position: ScalablePosition}>();

const dimensions = ref<Dimensions>({ width: 0, height: 0 });

function setScreenSize() {
  // TODO diviser coords par scale, et utiliser tout en valeurs absolues partout, avec translate/resize du g principal
  dimensions.value = { width: window.innerWidth / position.scale, height: window.innerHeight / position.scale }
}

function nbRacks() {
  return Math.ceil(((dimensions.value.height / RACK_HEIGHT) + 1) / position.scale);
}

function nbSlots() {
  return Math.ceil(((dimensions.value.width / SLOT_SIZE) + 1) / position.scale);
}

function origin(): Coordinates {
  return {
    x: position.x % (SLOT_SIZE * position.scale),
    y: position.y % (RACK_HEIGHT * position.scale),
  }
}

window.addEventListener('resize', setScreenSize);
setScreenSize();
</script>

<style scoped>
text {
  pointer-events: none;
  user-select: none;
}
</style>