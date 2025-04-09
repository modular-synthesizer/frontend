<template>
  <Suspense><Control v-bind="props" :dragged :dropped /></Suspense>
</template>

<script setup lang="ts">
import type { Synthesizer } from "~/types/Index";
import type { AudioModule } from "~/types/modules/AudioModule";
import type { ModControl } from "~/types/tools/Control";
import type { DragCallback } from "~/types/draggables/DragDeclaration";
import type { Parameter } from "~/types/modules/Parameter";
import { eventbus } from "~/utils/eventbus/EventBus";
import { setValue } from "~/utils/functions/parameters";

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

const parameter: Parameter|undefined = props.module.parameters[props.control.payload.target];
if (parameter) {
  eventbus.subscribe(`${parameter.id}.update.parameter`, (p: Parameter) => {
    const newT: number = Number.parseInt(`${p.t}`)
    /**
     * This mecanism does avoid putting the responsibility of the order of updates on the network
     * By assigning them a timestamp and comparing it, we can eliminate "less recent" updates that
     * were made by another user earlier in time, but delayed by the network.
     */
    if (parameter.t < newT) {
      setValue(parameter, p.value)
      parameter.t = newT
    }
  })
}
</script>