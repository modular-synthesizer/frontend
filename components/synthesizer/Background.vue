<template>
  <defs>
    <pattern id="singleSlot" :width="1/nbSlots()" :height="1/nbRacks()" viewPort="0,0,20,400">
      <rect :width="SLOT_SIZE" :height="SLOT_SIZE" class="fill-grey-darken-3" />
      <rect :width="SLOT_SIZE" :height="SLOT_SIZE" :y="RACK_HEIGHT - SLOT_SIZE" class="fill-grey-darken-3" />
      <rect :width="SLOT_SIZE" :height="SLOT_SIZE - 1" class="fill-grey-lighten-2" />
      <rect :width="SLOT_SIZE" :height="SLOT_SIZE - 2" y="381" class="fill-grey-lighten-2" />
      <circle cx="10" cy="10" r="5" class="fill-grey-darken-1" />
      <circle cx="10" cy="10" r="3" class="fill-black" />
      <circle cx="10" cy="390" r="5" class="fill-grey-darken-1" />
      <circle cx="10" cy="390" r="3" class="fill-black" />
    </pattern>
  </defs>
  <g :transform="`scale(${position.scale} ${position.scale})`">
    <g :transform="`translate(${origin().x} ${origin().y})`">
      <rect
        :height="nbRacks() * RACK_HEIGHT"
        :width="nbSlots() * SLOT_SIZE"
        fill="url(#singleSlot)"
      />
    </g>
  </g>
</template>

<script setup lang="ts">
import type { Coordinates, ScaledCoordinates } from '~/types/utils/Coordinates';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';

type Dimensions = { width: number, height: number }

const { position } = defineProps<{position: ScaledCoordinates}>();

const dimensions = ref<Dimensions>({ width: 0, height: 0 });

function setScreenSize() {
  dimensions.value = {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

function screenWidth() {
  return dimensions.value.width / position.scale
}

function screenHeight() {
  return dimensions.value.height / position.scale
}

function nbRacks() {
  return Math.ceil((screenHeight() / RACK_HEIGHT) + 1);
}

function nbSlots() {
  return Math.ceil((screenWidth() / SLOT_SIZE) + 1);
}

function origin(): Coordinates {
  return {
    x: (position.x / position.scale) % SLOT_SIZE - SLOT_SIZE,
    y: (position.y / position.scale) % RACK_HEIGHT - RACK_HEIGHT,
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