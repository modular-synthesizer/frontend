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
import type { Draggable, ScaledCoordinates } from '~/types/utils/Coordinates';
import { zoom } from '~/utils/functions/geometry';
import { scale, translate } from '~/utils/functions/svg';
import { PanStrategy } from '~/utils/draggables/PanStrategy';
import { DragStrategy } from '~/utils/draggables/DragStrategy';
import { IdleStrategy } from '~/utils/draggables/IdleStrategy';
import type { IStrategy } from '~/utils/draggables/IStrategy';

const { height, target, width } = defineProps({
  height: { type: String, default: '100%' },
  target: { type: Object as PropType<ScaledCoordinates>, required: true },
  width: { type: String, default: '100%', },
});

type Emits = {
  zoom: [ number ],
}

const emit = defineEmits<Emits>();

const strategy: Ref<IStrategy> = ref(new IdleStrategy(target, target.scale));

function onmousedown($event: MouseEvent) {
  strategy.value = new PanStrategy(target, target.scale);
  strategy.value.start($event);
}

function onmousemove($event: MouseEvent) {
  strategy.value.move($event)
}

function onmouseup($event: MouseEvent) {
  strategy.value.end($event);
  strategy.value = new IdleStrategy(target, target.scale);
}

function onclick(draggable: Draggable, sx: number, sy: number, $event: MouseEvent) {
  strategy.value = new DragStrategy(draggable, target.scale, sx, sy);
  strategy.value.start($event);
}
</script>

<style scoped>
.synple-stage {
  background-color: cadetblue;
  height: v-bind('height');
  width: v-bind('width');
}
</style>