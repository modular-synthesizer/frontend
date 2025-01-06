<template>
  <stage-draggable v-bind="{ click, target }" @dropped="save">
    <slot></slot>
  </stage-draggable>
</template>

<script setup lang="ts">
import { RACK_HEIGHT, SLOT_SIZE } from '~/lib/utils/constants';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Draggable } from '~/types/utils/Coordinates';
import type { DragDeclaration } from '~/types/draggables/DragDeclaration'
import { repositories } from '~/lib/repositories';

const { click, module } = defineProps({
  click: { type: Function as PropType<DragDeclaration>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
});

const target: Ref<Draggable> = ref({
  x: module.slot * SLOT_SIZE,
  y: module.rack * RACK_HEIGHT,
  id: module.id,
});

function save() {
  module.rack = target.value.y / RACK_HEIGHT;
  module.slot = target.value.x / SLOT_SIZE;
  repositories.modules.update(module)
}
</script>