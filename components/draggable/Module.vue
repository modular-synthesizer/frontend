<template>
  <stage-draggable v-bind="{ click, target }">
    <slot></slot>
  </stage-draggable>
</template>

<script setup lang="ts">
import { RACK_HEIGHT, SLOT_SIZE } from '~/lib/utils/constants';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Coordinates } from '~/types/utils/Coordinates';
import type { DragDeclaration } from '../stage/strategies/AbstractStrategy';

const { click, module } = defineProps({
  click: { type: Function as PropType<DragDeclaration>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
});

const target: Ref<Coordinates> = ref({
  x: module.slot * SLOT_SIZE,
  y: module.rack * RACK_HEIGHT,
});
</script>