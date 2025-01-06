<template>
  <g @mousedown.prevent.stop="click(target, $event)"><slot /></g>
</template>

<script setup lang="ts">
import type { Coordinates } from '~/types/utils/Coordinates';

type MouseCallback = (target: Coordinates, $event: MouseEvent) => void;

const { click } = defineProps({
  click: { type: Function as PropType<MouseCallback>, required: true },
  target: { type: Object as PropType<Coordinates>, required: true },
});
</script>