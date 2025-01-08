<template>
  <knob-wrapper :control="control" :r="15" :module="module" :click="click" :synthesizer="synthesizer" />
</template>

<script setup lang="ts">
import type { DragDeclaration } from '~/types/draggables/DragDeclaration';
import type { Synthesizer } from '~/types/Index';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Control } from '~/types/tools/Control';

const { click, control, module, synthesizer } = defineProps({
  control: { type: Object as PropType<Control>, required: true },
  click: { type: Function as PropType<DragDeclaration>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});
</script>