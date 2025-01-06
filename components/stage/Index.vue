<template>
  <svg
    class="synple-stage"
    @wheel="emit('zoom', zoom(target, $event))"
    @mousedown="onmousedown"
    @mousemove="onmousemove"
    @mouseup="onmouseup"
  >
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
import { IdleStrategy, type IStrategy } from './strategies/AbstractStrategy';
import { PanStrategy } from './strategies/PanStrategy';
import { DragStrategy } from './strategies/DragStrategy';

const { height, target, width } = defineProps({
  height: { type: String, default: '100%' },
  target: { type: Object as PropType<ScaledCoordinates>, required: true },
  width: { type: String, default: '100%', },
});

type Emits = {
  zoom: [ number ],
  panned: [ Coordinates ],
}

const emit = defineEmits<Emits>();

let strategy: IStrategy = new IdleStrategy(target, target.scale);

function onmousedown($event: MouseEvent) {
  strategy = new PanStrategy(target, target.scale);
  strategy.start($event);
}

function onmousemove($event: MouseEvent) {
  strategy.move($event)
}

function onmouseup($event: MouseEvent) {
  strategy.end($event);
  emit('panned', target);
  strategy = new IdleStrategy(target, target.scale);
}

function onclick(draggable: Coordinates, sx: number, sy: number, $event: MouseEvent) {
  strategy = new DragStrategy(draggable, target.scale, sx, sy);
  strategy.start($event);
}
</script>

<style scoped>
.synple-stage {
  background-color: cadetblue;
  height: v-bind('height');
  width: v-bind('width');
}
</style>