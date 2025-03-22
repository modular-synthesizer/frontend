<template>
  <node v-if="capture" @mousedown.capture.prevent.stop="onmousedown" class="draggable-wrapper"><slot /></node>
  <node v-else @mousedown.prevent.stop="onmousedown" class="draggable-wrapper"><slot /></node>
</template>

<script setup lang="ts">
import { some } from 'lodash';
import type { Coordinates } from '~/types/utils/Coordinates';
import type { PlacedBox } from '~/types/utils/PlacedBox';
import { round, subtract } from '~/utils/functions/geometry';

type DragCallback = (callback: (coordinates: Coordinates) => void) => void;

const { collidesWith, sx, sy, target } = defineProps({
  sx: { type: Number, default: 1 },
  sy: { type: Number, default: 1 },
  target: { type: Object as PropType<PlacedBox>, required: true },
  collidesWith: { type: Array<PlacedBox>, default: () => [] },
  capture: { type: Boolean, default: false }
});

const dragged: DragCallback = inject('dragged') as DragCallback;
const dropped: DragCallback = inject('dropped') as DragCallback;
const mode: 'html'|'svg'|undefined = inject('mode');

const node: VNode = h(mode === 'html' ? 'div' : 'g')

const innerTarget: Ref<PlacedBox> = ref(target)

const offset: Ref<Coordinates> = ref({ x: 0, y: 0 });

const emit = defineEmits<{ dropped: [ PlacedBox ], moved: [ PlacedBox ] }>();

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
  dragged(() => {
    const coordinates: Coordinates = useCoordinates().get();
    const rounded: Coordinates = round(subtract(coordinates, offset.value), { sx, sy });
    if (collidesWith.length > 0 && collides({ ...target, ...rounded }, collidesWith)) return;
    innerTarget.value.x = rounded.x;
    innerTarget.value.y = rounded.y;
    emit('moved', innerTarget.value);
  });
  dropped(() => emit('dropped', innerTarget.value));
}

const translateDraggable = computed(() => {
  return `${innerTarget.value.x}px ${innerTarget.value.y}px`
})
</script>

<style>
.draggable-wrapper {
  translate: v-bind(translateDraggable)
}
</style>