<template>
  <Suspense><Control v-bind="props" :dragged :dropped /></Suspense>
</template>

<script setup lang="ts">
import type { Synthesizer } from "~/types/Index";
import type { AudioModule } from "~/types/modules/AudioModule";
import type { ModControl } from "~/types/blueprints/Control";
import type { DragCallback } from "~/types/draggables/DragDeclaration";

const props = defineProps({
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
  control: { type: Object as PropType<ModControl>, required: true, },
  module: { type: Object as PropType<AudioModule>, required: true },
  noEvents: { type: Boolean, default: false}
});

const Control = defineAsyncComponent(() => {
  return import(`../control/${props.control.component}.vue`);
});

const dragged: DragCallback = inject('dragged') as DragCallback;
const dropped: DragCallback = inject('dropped') as DragCallback;
</script>