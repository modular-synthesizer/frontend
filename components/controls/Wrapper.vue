<template>
  <component :is="component.default" v-bind="{ ...props, ...control.payload }"/>
</template>

<script setup lang="ts">
import type { Synthesizer } from "~/types/Index";
import type { AudioModule } from "~/types/modules/AudioModule";
import type { Control } from "~/types/tools/Control";

const props = defineProps({
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
  control: { type: Object as PropType<Control>, required: true, },
  mod: { type: Object as PropType<AudioModule>, required: true, },
});

console.log("../control/" + props.control.component + ".vue")
const component = await import("../control/" + props.control.component + ".vue");
console.log(component);
</script>