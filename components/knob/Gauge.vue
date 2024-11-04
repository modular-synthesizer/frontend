<template>
  <path :d="arcPath(x, y, radius, startAngle, endAngle)" stroke-width="2" class="stroke-grey-darken-2"/>
  <path :d="arcPath(x, y, radius, startAngle, angle)" stroke-width="2" class="stroke-blue" />
  <circle :cx="lightCoords.x" :cy="lightCoords.y" :r="2" class="fill-blue stroke-blue-lighten-1" />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import ICoordinates from '~~/lib/interfaces/ICoordinates';
import IParameter from '~~/lib/interfaces/IParameter';

const { x, y, startAngle, endAngle, radius, parameter } = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  radius: { type: Number, required: true },
  startAngle: { type: Number, required: true },
  endAngle: { type: Number, required: true },
  parameter: { type: Object as PropType<IParameter>, required: true },
});

const lightCoords: ComputedRef<ICoordinates> = computed(() => {
  return polarToCartesian(x, y, radius, angle.value)
});

const angle: ComputedRef<number> = computed(() => {
  const { maximum, minimum, value } = parameter;
  const deltaAngle: number = endAngle - startAngle;
  if (maximum === undefined || minimum === undefined) return startAngle;
  return startAngle + (deltaAngle / maximum * value)
});
</script>