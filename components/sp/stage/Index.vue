<template>
  <rootNode
    class="synple-stage"
    @wheel.passive="onwheel"
    @mousedown="onmousedown"
    @mousemove="callbacks.dragged"
    @mouseup.capture="onmouseup"
    @mouseleave="onmouseup"
  >
    <scaleNode class="transform">
      <bgNode class="bg-translate">
        <slot name="background" />
      </bgNode>
      <translateNode class="item-translate">
        <slot></slot>
      </translateNode>
    </scaleNode>
  </rootNode>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { RACK_HEIGHT, SLOT_SIZE } from '~/lib/utils/constants';
import type { Coordinates, ScaledCoordinates } from '~/types/utils/Coordinates';
import { subtract, zoom } from '~/utils/functions/geometry';
import { translate } from '~/utils/functions/svg';

type Mode = "html"|"svg"

const { bgHeight, bgWidth, height, mode, target, width } = defineProps({
  height: { type: String, default: '100%' },
  target: { type: Object as PropType<ScaledCoordinates>, required: true },
  width: { type: String, default: '100%', },
  bgHeight: { type: Number, default: RACK_HEIGHT },
  bgWidth: { type: Number, default: SLOT_SIZE },
  mode: { type: String as PropType<Mode>, default: "svg" }
});

const innerTarget: Ref<ScaledCoordinates> = ref(target);

const tags: Record<string, Record<Mode, VNode>> = {
  root: { html: h('div'), svg: h('svg') },
  scale: { html: h('div'), svg: h('g') },
  bg: { html: h('div'), svg: h('g') },
  translate: { html: h('div'), svg: h('g') },
};

const rootNode = tags.root[mode];
const scaleNode = tags.scale[mode];
const bgNode = tags.bg[mode];
const translateNode = tags.translate[mode];

type Emits = {
  zoom: [ number ],
  panned: [ Coordinates ],
}

const emit = defineEmits<Emits>();

const event: Ref<Coordinates> = ref({ x: 0, y: 0 });

const originOffset: Ref<Coordinates> = ref({ x: 0, y: 0 });

function getCoords($event: MouseEvent) {
  return {
    x: $event.clientX / innerTarget.value.scale,
    y: $event.clientY / innerTarget.value.scale,
  }
}

function onmousedown($event: MouseEvent) {
  event.value = getCoords($event);
  originOffset.value = subtract(getCoords($event), innerTarget.value);
  dragged(($event: MouseEvent) => {
    const offset: Coordinates = subtract(getCoords($event), event.value);
    innerTarget.value.x = event.value.x + offset.x - originOffset.value.x;
    innerTarget.value.y = event.value.y + offset.y - originOffset.value.y;
  });
  dropped(() => emit('panned', innerTarget.value));
}

function onmouseup($event: MouseEvent) {
  callbacks.value.dropped($event);
  callbacks.value.dragged = () => { };
  callbacks.value.dropped = () => { }
}

function onwheel($event: WheelEvent) {
  const zoomValue: number = zoom(innerTarget.value, $event)
  innerTarget.value.scale = zoomValue;
  emit('zoom', zoomValue)
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

provide("dragged", dragged);

function dropped(callback: Callback) {
  callbacks.value.dropped = callback;
}

provide("dropped", dropped);

useCoordinates().setReference(target);

const numericScale = computed(() => innerTarget.value.scale);

const bgTranslate = computed(() => translate({
  x: (innerTarget.value.x - 1) * bgWidth,
  y: (innerTarget.value.y - 1) * bgHeight,
}));

provide("mode", mode)

const itemTranslate = computed(() => `${innerTarget.value.x}px ${innerTarget.value.y}px`);
</script>

<style>
.synple-stage {
  background-color: cadetblue;
  height: v-bind('height');
  width: v-bind('width');
}

.transform {
  transform: scale(v-bind(numericScale));
}

.translate-bg {
  transform: v-bind(bgTranslate);
}

.item-translate {
  translate: v-bind(itemTranslate);
}
</style>