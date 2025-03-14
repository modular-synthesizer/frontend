<template>
  <Suspense><Control v-bind="props" /></Suspense>
</template>

<script setup lang="ts">
import type { Synthesizer } from "~/types/Index";
import type { AudioModule } from "~/types/modules/AudioModule";
import type { ModControl } from "~/types/tools/Control";
import type { DragCallback } from "~/types/draggables/DragDeclaration";
import type { Parameter } from "~/types/modules/Parameter";
import { eventbus } from "~/lib/utils/eventbus/EventBus";
import { setValue } from "~/utils/functions/parameters";

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

const parameter: Parameter|undefined = props.module.parameters[props.control.payload.target];
if (parameter) {
  eventbus.subscribe(`${parameter.id}.update.parameter`, (p: Parameter) => {
    setValue(parameter, p.value)
  })
}
</script>