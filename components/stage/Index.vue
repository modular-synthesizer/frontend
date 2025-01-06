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
        <slot :props="{ click: onclick }"></slot>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Coordinates, ScaledCoordinates } from '~/types/utils/Coordinates';
import { zoom } from '~/utils/functions/geometry';
import { scale, translate } from '~/utils/functions/svg';
import { DragStrategy, IdleStrategy } from './strategies/DragStrategy';
import { PanStrategy } from './strategies/PanStrategy';

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

enum State { PANNING = 'PANNING', IDLE = 'IDLE', DRAGGING = 'DRAGGING' };

const state: Ref<State> = ref(State.IDLE);
let strategy: DragStrategy = new IdleStrategy(target, target.scale);

function onmousedown($event: MouseEvent) {
  state.value = State.PANNING;
  strategy = new PanStrategy(target, target.scale);
  strategy.start($event);
}

function onmousemove($event: MouseEvent) {
  strategy.move($event)
}

function round(value: number, step: number) {
  return Math.round(value / step) * step;
}

function onmouseup($event: MouseEvent) {
  if (state.value === State.PANNING) {
    strategy.end($event);
    emit('panned', target);
  }
  state.value = State.IDLE;
}

function onclick(draggable: Coordinates, $event: MouseEvent): void {
  // state.value = State.DRAGGING;
  // element = draggable;
  // if (element.value == undefined) return;
  // origin.value.x = element.value.x;
  // origin.value.y = element.value.y;
  // event.value.x = $event.clientX;
  // event.value.y = $event.clientY;
}
</script>

<style scoped>
.synple-stage {
  background-color: cadetblue;
  height: v-bind('height');
  width: v-bind('width');
}
</style>