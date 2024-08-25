<template>
  <defs>
    <pattern id="bg" patternUnits="userSpaceOnUse" :width="BG_SIZE" :height="BG_SIZE">
      <rect :x="0" :y="0" :width="DOT_SIZE" :height="DOT_SIZE" fill="white"></rect>
    </pattern>
  </defs>
  <rect
    :width="`${120 / scale}%`"
    :height="`${120 / scale}%`"
    fill="url(#bg)"
    @mousedown.left.stop="startLocalDrag"
    @mousemove.stop="moveLocalDrag"
    @mouseleave="endLocalDrag"
    @mouseup="endLocalDrag"
  />
</template>

<script setup lang="ts">
import ICoordinates from '~~/lib/interfaces/ICoordinates';

const DOT_SIZE = 2;

const emit = defineEmits<{ move: [x: number, y: number], start: []}>();

const { scale } = defineProps({
  scale: { type: Number, default: 1 }
})

const offset: Ref<ICoordinates> = ref({ x: 0, y: 0 });

const start: Ref<ICoordinates> = ref({ x: 0, y: 0 });

const coords: Ref<ICoordinates> = ref({ x: 0, y: 0 });

const dragged: Ref<boolean> = ref(false);

function startLocalDrag(event: MouseEvent) {
  emit('start');
  start.value.x = event.clientX * scale;
  start.value.y = event.clientY * scale;
  dragged.value = true;
}

function setCoords(event: MouseEvent) {
  coords.value.x = (offset.value.x + (event.clientX - start.value.x));
  coords.value.y = (offset.value.y + (event.clientY - start.value.y));
  emit("move", coords.value.x, coords.value.y)
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