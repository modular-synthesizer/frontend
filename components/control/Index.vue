<template>
  <template v-if="customComponent">
    <component :is="customComponent" v-bind="props" />
  </template>
</template>

<script setup lang="ts">
import type { DragDeclaration } from "~/types/draggables/DragDeclaration";
import type { Synthesizer } from "~/types/Index";
import type { AudioModule } from "~/types/modules/AudioModule";
import type { Control } from "~/types/tools/Control";
import * as components from "./index";

const props = defineProps({
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
  control: { type: Object as PropType<Control>, required: true, },
  click: { type: Function as PropType<DragDeclaration>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
});

// @ts-ignore
const customComponent = components[props.control.component]
</script>