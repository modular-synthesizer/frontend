<template>
  <svg
    class="synple-stage"
    @wheel.passive="emit('zoom', zoom(target, $event))"
    @mousedown="onmousedown"
    @mousemove="callbacks.dragged"
    @mouseup.capture="onmouseup"
    @mouseleave="onmouseup"
  >
    <g :transform="scale(target)">
      <g :transform="translate({ x: (target.x % bgWidth) - bgWidth, y: (target.y % bgHeight) - bgHeight })">
        <slot name="background" />
      </g>
      <g :transform="translate(target)">
        <slot :props="{ dragged, dropped, scale: target.scale }"></slot>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { RACK_HEIGHT, SLOT_SIZE } from '~/lib/utils/constants';
import type { Coordinates, ScaledCoordinates } from '~/types/utils/Coordinates';
import { subtract, zoom } from '~/utils/functions/geometry';
import { scale, translate } from '~/utils/functions/svg';

const { bgHeight, bgWidth, height, target, width } = defineProps({
  height: { type: String, default: '100%' },
  target: { type: Object as PropType<ScaledCoordinates>, required: true },
  width: { type: String, default: '100%', },
  bgHeight: { type: Number, default: RACK_HEIGHT },
  bgWidth: { type: Number, default: SLOT_SIZE },
});

type Emits = {
  zoom: [ number ],
  panned: [ Coordinates ],
}

const emit = defineEmits<Emits>();

const event: Ref<Coordinates> = ref({ x: 0, y: 0 });

const originOffset: Ref<Coordinates> = ref({ x: 0, y: 0 });

function getCoords($event: MouseEvent) {
  return {
    x: $event.clientX / target.scale,
    y: $event.clientY / target.scale,
  }
}

function onmousedown($event: MouseEvent) {
  event.value = getCoords($event);
  originOffset.value = subtract(getCoords($event), target);
  dragged(($event: MouseEvent) => {
    const offset: Coordinates = subtract(getCoords($event), event.value);
    target.x = event.value.x + offset.x - originOffset.value.x;
    target.y = event.value.y + offset.y - originOffset.value.y;
  });
  dropped(() => emit('panned', target));
}

function onmouseup($event: MouseEvent) {
  callbacks.value.dropped($event);
  callbacks.value.dragged = () => { };
  callbacks.value.dropped = () => { }
}

type Callback = ($event: MouseEvent) => void;

type Callbacks = { dragged: Callback, dropped: Callback };

const callbacks: Ref<Callbacks> = ref({
  dragged: () => {},
  dropped: () => {},
});

function dragged(callback: Callback) {
  callbacks.value.dragged = callback;
}

function dropped(callback: Callback) {
  callbacks.value.dropped = callback;
}
</script>

<style scoped>
.synple-stage {
  background-color: cadetblue;
  height: v-bind('height');
  width: v-bind('width');
}
</style>