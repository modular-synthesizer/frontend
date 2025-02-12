<template>
  <g @mousedown.prevent.stop="onmousedown" :transform="translate(target)"><slot /></g>
</template>

<script setup lang="ts">
import { some } from 'lodash';
import type { Coordinates } from '~/types/utils/Coordinates';
import type { PlacedBox } from '~/types/utils/PlacedBox';
import { round, subtract } from '~/utils/functions/geometry';
import { translate } from '~/utils/functions/svg';

type DragCallback = (callback: (coordinates: Coordinates) => void) => void;

const { dragged, dropped, collidesWith, sx, sy, target } = defineProps({
  dragged: { type: Function as PropType<DragCallback>, required: true },
  dropped: { type: Function as PropType<DragCallback>, required: true },
  sx: { type: Number, default: 1 },
  sy: { type: Number, default: 1 },
  target: { type: Object as PropType<PlacedBox>, required: true },
  collidesWith: { type: Array<PlacedBox>, default: () => [] },
});

const offset: Ref<Coordinates> = ref({ x: 0, y: 0 });

const emit = defineEmits<{ dropped: [ ], moved: [ PlacedBox ] }>();

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
    target.x = rounded.x;
    target.y = rounded.y;
    emit('moved', target);
  });
  dropped(() => emit('dropped'));
}
</script>