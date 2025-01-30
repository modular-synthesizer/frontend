<template>
  <cable :start="origin" :end="destination" :show-cable="useLinksDisplay().displayed" />
</template>

<script setup lang="ts">
import type { Port } from '~/types/modules/Port';
import type { Coordinates } from '~/types/utils/Coordinates';
import { getAbsoluteCoordinates } from '~/utils/functions/ports';

const { from, to } = defineProps({
  from: { type: Object as PropType<Port>, required: true },
  to: { type: Object as PropType<Port>, required: true },
});

const origin: ComputedRef<Coordinates> = computed(() => getAbsoluteCoordinates(from))
const destination: ComputedRef<Coordinates> = computed(() => getAbsoluteCoordinates(to))
</script>