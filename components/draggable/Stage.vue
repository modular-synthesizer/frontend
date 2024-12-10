<template>
  <svg
    @mousedown.left.stop="dragStart(position, $event)"
    @mouseleave="triggerDragEnd($event); emit('move')"
    @mouseup="triggerDragEnd($event); emit('move')"

    @touchstart.passive="dragStart(position, $event.touches[0] as any)"
    @touchend.passive="triggerDragEnd($event.touches[0] as any); emit('move')"

    @wheel.passive.stop="setScale(position, $event); emit('zoom')"
    class="bg-grey-darken-1"
  >
    <synthesizer-background :position="position" />
    <g :transform="`translate(${position.x} ${position.y}) scale(${position.scale} ${position.scale})`" fill="url(#eurorackSlot)">
      <slot></slot>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { ScalablePosition } from '~~/lib/types/ScalablePosition';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';

type Dimensions = { width: number, height: number }

const { position } = defineProps<{position: ScalablePosition}>();
const emit = defineEmits(['zoom', 'move']);

const dimensions = ref<Dimensions>({ width: 0, height: 0 });
const nbRacks = ref(0);
const nbSlots = ref(0);
const origin = ref({ x: 0, y: 0 });
setSize();

function setSize() {
  dimensions.value = { width: window.innerWidth, height: window.innerHeight }
  nbRacks.value = Math.ceil(dimensions.value.height / RACK_HEIGHT);
  nbSlots.value = Math.ceil(dimensions.value.width / SLOT_SIZE);
  origin.value = {
    x: (dimensions.value.width + position.x) % SLOT_SIZE,
    y: (dimensions.value.height + position.y) % RACK_HEIGHT,
  }
}

window.addEventListener('resize', setSize);
</script>