<template>
  <node v-if="capture" @mousedown.capture.prevent.stop="onmousedown" class="draggable-wrapper"><slot /></node>
  <node v-else @mousedown.prevent.stop="onmousedown" class="draggable-wrapper"><slot /></node>
</template>

<script setup lang="ts" generic="Draggable extends PlacedBox">
import { some } from 'lodash';
import type { Coordinates } from '~/types/utils/Coordinates';
import type { PlacedBox } from '~/types/utils/PlacedBox';
import { round, subtract } from '~/utils/functions/geometry';
import type { Callback } from './Index.vue';

type Props = {
  sx?: number, sy?: number, target: Draggable, collidesWith?: Draggable[], capture?: boolean, passive?: boolean
}
const { collidesWith = [], sx = 1, sy = 1, target, passive = false, capture = false } = defineProps<Props>();

type DragFunction = (callback: Callback) => void

const dragged: DragFunction = inject('dragged') as DragFunction;
const dropped: DragFunction = inject('dropped') as DragFunction;
const mode: 'html'|'svg'|undefined = inject('mode');

const node: VNode = h(mode === 'html' ? 'div' : 'g')

const innerTarget: Ref<PlacedBox> = ref(target as PlacedBox)

const offset: Ref<Coordinates> = ref({ x: 0, y: 0 });

const emit = defineEmits<{ dropped: [ Draggable ], moved: [ Draggable ] }>();

function collide(first: PlacedBox, second: PlacedBox): boolean {
  if (first.id === second.id) return false;
  if (first.x >= second.x + second.width) return false;
  if (first.y >= second.y + second.height) return false;
  return true;
}

function collides(tested: PlacedBox, colliders: PlacedBox[]): boolean {
  return some(colliders, (collider: PlacedBox) => {
    return collide(tested, collider) && collide(collider, tested);
  })
}

function onmousedown() {
  offset.value = subtract(useCoordinates().get(), target);
  dragged(($event: MouseEvent) => {
    const coordinates: Coordinates = useCoordinates().get();
    const rounded: Coordinates = round(subtract(coordinates, offset.value), { sx, sy });
    if (collidesWith.length > 0 && collides({ ...target, ...rounded }, collidesWith)) return;
    innerTarget.value.x = rounded.x;
    innerTarget.value.y = rounded.y;
    emit('moved', target);
    $event.stopPropagation();
  });
  dropped(() => emit('dropped', target));
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