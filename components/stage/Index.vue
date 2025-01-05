<template>
  <svg
    class="synple-stage"
    @wheel="emit('zoom', zoom(target, $event))"
    @mousedown="onmousedown"
    @mousemove="onmousemove"
    @mouseup="onmouseup"
  >
    <text x="10" y="15">{{ state }}</text>
    <g :transform="scale(target)">
      <g :transform="translate(target)">
        <slot name="draggables" :props="{ 'v-on:click': onclick }"></slot>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Coordinates, ScaledCoordinates } from '~/types/utils/Coordinates';
import { zoom } from '~/utils/functions/geometry';
import { scale, translate } from '~/utils/functions/svg';

const { height, sx, sy, target, width } = defineProps({
  height: { type: String, default: '100%' },
  sx: { type: Number, default: 1 },
  sy: { type: Number, default: 1 },
  target: { type: Object as PropType<ScaledCoordinates>, required: true },
  width: { type: String, default: '100%', },
});

type Emits = {
  zoom: [ number ],
  panned: [ Coordinates ],
}

const emit = defineEmits<Emits>();

enum State { PANNING = 'PANNING', IDLE = 'IDLE' };

const state: Ref<State> = ref(State.IDLE);
const origin: Ref<Coordinates> = ref({ x: 0, y: 0 });
const event: Ref<Coordinates> = ref({ x: 0, y: 0 });

function onmousedown($event: MouseEvent) {
  state.value = State.PANNING;
  origin.value.x = target.x;
  origin.value.y = target.y;
  event.value.x = $event.clientX;
  event.value.y = $event.clientY;
}

function onmousemove({ clientX: x, clientY: y }: MouseEvent) {
  if (state.value === State.IDLE) return;
  target.x = round(origin.value.x + (x - event.value.x) / target.scale, sx);
  target.y = round(origin.value.y + (y - event.value.y) / target.scale, sy);
}

function round(value: number, step: number) {
  return Math.round(value / step) * step;
}

function onmouseup() {
  if (state.value === State.PANNING) emit('panned', target);
  state.value = State.IDLE;
}

function onclick() {

}
</script>

<style scoped>
.synple-stage {
  background-color: cadetblue;
  height: v-bind('height');
  width: v-bind('width');
}
</style>