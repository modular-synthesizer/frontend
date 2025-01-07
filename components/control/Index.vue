<template>
  <control-small-knob v-bind="props" v-if="control.component === 'SmallKnob'" />
  <control-port v-bind="props" v-if="control.component === 'Port'" />
</template>

<script setup lang="ts">
import type { DragDeclaration } from '~/types/draggables/DragDeclaration';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Control } from '~/types/tools/Control';

const props = defineProps({
  control: { type: Object as PropType<Control>, required: true },
  click: { type: Function as PropType<DragDeclaration>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
});
</script>