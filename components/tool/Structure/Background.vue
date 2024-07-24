<template>
  <defs>
    <pattern id="bg" patternUnits="userSpaceOnUse" :width="BG_SIZE" :height="BG_SIZE">
      <rect :x="mod(coords.x)" :y="mod(coords.y)" :width="DOT_SIZE" :height="DOT_SIZE" fill="white"></rect>
    </pattern>
  </defs>
  <rect
    width="100%"
    height="100%"
    fill="url(#bg)"
    @mousedown.left.stop="startLocalDrag"
    @mousemove.stop="moveLocalDrag"
    @mouseleave="endLocalDrag"
    @mouseup="endLocalDrag"
  />
</template>

<script setup lang="ts">
import ICoordinates from '~~/lib/interfaces/ICoordinates';

const BG_SIZE = 60;
const DOT_SIZE = 2;

const emit = defineEmits<{ move: [x: number, y: number]}>();

const offset: Ref<ICoordinates> = ref({ x: 0, y: 0 });

const start: Ref<ICoordinates> = ref({ x: 0, y: 0 });

const coords: Ref<ICoordinates> = ref({ x: 0, y: 0 });

const dragged: Ref<boolean> = ref(false);

function startLocalDrag(event: MouseEvent) {
  start.value.x = event.clientX;
  start.value.y = event.clientY;
  dragged.value = true;
}

function setCoords(event: MouseEvent) {
  coords.value.x = offset.value.x + (event.clientX - start.value.x);
  coords.value.y = offset.value.y + (event.clientY - start.value.y);
  emit("move", coords.value.x, coords.value.y)
}

function mod(val: number): number {
  return ((val % BG_SIZE) + BG_SIZE) % BG_SIZE;
}

function moveLocalDrag(event: MouseEvent) {
  if (!dragged.value) return;
  setCoords(event);
}

function endLocalDrag() {
  dragged.value = false;
  offset.value.x = coords.value.x;
  offset.value.y = coords.value.y;
}
</script>