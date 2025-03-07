<template>
  <Suspense><Control v-bind="props" /></Suspense>
</template>

<script setup lang="ts">
import type { Synthesizer } from "~/types/Index";
import type { AudioModule } from "~/types/modules/AudioModule";
import type { ModControl } from "~/types/tools/Control";
import type { DragCallback } from "~/types/draggables/DragDeclaration";

const props = defineProps({
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
  control: { type: Object as PropType<ModControl>, required: true, },
  dragged: { type: Function as DragCallback, required: true },
  dropped: { type: Function as DragCallback, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
});

const Control = defineAsyncComponent(() => {
  return import(`../control/${props.control.component}.vue`);
});
</script>