<template>
  <stage-draggable v-bind="{ click, target: module }" @dropped="save">
    <slot></slot>
  </stage-draggable>
</template>

<script setup lang="ts">
import { RACK_HEIGHT, SLOT_SIZE } from '~/lib/utils/constants';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { DragDeclaration } from '~/types/draggables/DragDeclaration'
import { repositories } from '~/lib/repositories';

const { click, module } = defineProps({
  click: { type: Function as PropType<DragDeclaration>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
});

function save() {
  module.rack = module.y / RACK_HEIGHT;
  module.slot = module.x / SLOT_SIZE;
  repositories.modules.update(module)
}
</script>