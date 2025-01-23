<template>
  <knob-wrapper :r=25 v-bind="props" />
</template>

<script setup lang="ts">
import type { DragDeclaration } from '~/types/draggables/DragDeclaration';
import type { Synthesizer } from '~/types/Index';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Control } from '~/types/tools/Control';

const props = defineProps({
  control: { type: Object as PropType<Control>, required: true },
  click: { type: Function as PropType<DragDeclaration>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});
</script>