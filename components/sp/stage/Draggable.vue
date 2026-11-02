<template>
  <node v-if="capture" @mousedown.capture.prevent.stop="onmousedown" class="draggable-wrapper"><slot /></node>
  <node v-else @mousedown.prevent.stop="onmousedown" class="draggable-wrapper"><slot /></node>
</template>

<script setup lang="ts" generic="Draggable extends PlacedBox">
import type { Coordinates } from '~/types/utils/Coordinates';
import type { PlacedBox } from '~/types/utils/PlacedBox';
import { round, subtract } from '~/utils/functions/geometry';
import type { Callback } from './Index.vue';
import type { Position } from '~/features/viewports/core/data/Position.type.ts';

type Props = {
  sx?: number, sy?: number, target: Draggable, capture?: boolean, accepts?: (position: Position) => boolean
}
const { accepts = () => true, sx = 1, sy = 1, target, capture = false } = defineProps<Props>();

type DragFunction = (callback: Callback) => void

const dragged: DragFunction = inject('dragged') as DragFunction;
const dropped: DragFunction = inject('dropped') as DragFunction;
const mode: 'html'|'svg'|undefined = inject('mode');

const node: VNode = h(mode === 'html' ? 'div' : 'g')

const innerTarget: Ref<PlacedBox> = ref(target as PlacedBox)

const offset: Ref<Coordinates> = ref({ x: 0, y: 0 });

type Emits = { dropped: [ Draggable ], moved: [ Draggable ], released: [ from: Position, to: Position ] }

const emit = defineEmits<Emits>();

function onmousedown() {
  const start: Position = { x: target.x, y: target.y }
  offset.value = subtract(useCoordinates().get(), target);
  dragged(($event: MouseEvent) => {
    const rounded: Coordinates = round(subtract(useCoordinates().get(), offset.value), { sx, sy });
    if (!accepts(rounded)) return
    innerTarget.value.x = rounded.x;
    innerTarget.value.y = rounded.y;
    emit('moved', target);
    $event.stopPropagation();
  });
  dropped(() => {
    emit('released', start, { x: target.x, y: target.y})
  });
}

const translateDraggable = computed(() => {
  return `${innerTarget.value.x}px ${innerTarget.value.y}px`
})

const x = computed(() => `${innerTarget.value.x}px`)
const y = computed(() => `${innerTarget.value.y}px`)
</script>

<style>
g.draggable-wrapper {
  translate: v-bind(translateDraggable);
  pointer-events: all;
}
div.draggable-wrapper {
  display: inline-block;
  position: absolute;
  left: v-bind(x);
  top: v-bind(y);
}
</style>