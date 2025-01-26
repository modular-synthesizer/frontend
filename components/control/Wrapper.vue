<template>
  <template v-if="customComponent">
    <component :is="customComponent" v-bind="props" />
  </template>
</template>

<script setup lang="ts">
import type { Synthesizer } from "~/types/Index";
import type { AudioModule } from "~/types/modules/AudioModule";
import type { Control } from "~/types/tools/Control";
import * as components from "./index";
import type { DragCallback } from "~/types/draggables/DragDeclaration";


const props = defineProps({
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
  control: { type: Object as PropType<Control>, required: true, },
  dragged: { type: Function as DragCallback, required: true },
  dropped: { type: Function as DragCallback, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
});

// @ts-ignore
const customComponent = components[props.control.component]
</script>