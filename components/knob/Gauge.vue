<template>
  <path :d="arcPath(x, y, radius, startAngle, endAngle)" stroke-width="2" class="stroke-grey-darken-2"/>
  <path :d="arcPath(x, y, radius, startAngle, angle)" stroke-width="2" class="stroke-blue" />
  <circle
    :cx="polarToCartesian(x, y, radius, angle).x"
    :cy="polarToCartesian(x, y, radius, angle).y"
    :r="2"
    class="fill-blue stroke-blue-lighten-1"
  />
</template>

<script setup lang="ts">
import type { Parameter } from '~/types/modules/Parameter';
import { polarToCartesian, arcPath } from '~/utils/functions/geometry'

const { x, y, startAngle, endAngle, radius, parameter } = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  radius: { type: Number, required: true },
  startAngle: { type: Number, required: true },
  endAngle: { type: Number, required: true },
  parameter: { type: Object as PropType<Parameter>, required: true },
});

const angle: ComputedRef<number> = computed(() => {
  const { maximum, minimum, value } = parameter;
  const deltaAngle: number = endAngle - startAngle;
  if (maximum === undefined || minimum === undefined) return startAngle;
  return startAngle + (deltaAngle / maximum * value)
});
</script>