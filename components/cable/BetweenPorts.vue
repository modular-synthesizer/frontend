<template>
  <cable :start="origin" :end="destination" :show-cable="useLinksDisplay().displayed" />
</template>

<script setup lang="ts">
import { useLinksDisplay } from '~/composables/links/useLinksDisplay';
import type { Control } from '~/types/Index';
import type { Port } from '~/types/modules/Port';
import type { Coordinates } from '~/types/utils/Coordinates';

const { from, to } = defineProps({
  from: { type: Object as PropType<Port>, required: true },
  to: { type: Object as PropType<Port>, required: true },
});

function getControl({ mod, name }: Port): Control {
  return mod.controls.find(c => c.payload.target === name && c.component === 'Port') as Control;
}

function getAbsoluteCoordinates(port: Port): Coordinates {
  return {
    x: +(getControl(port).payload.x ?? 0) + port.mod.x,
    y: +(getControl(port).payload.y ?? 0) + port.mod.y,
  }
}

const origin: ComputedRef<Coordinates> = computed(() => getAbsoluteCoordinates(from))
const destination: ComputedRef<Coordinates> = computed(() => getAbsoluteCoordinates(to))
</script>