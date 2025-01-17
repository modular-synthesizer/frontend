<template>
  <component :is="component" :control="control" :mod="mod" v-bind="control.payload"/>
</template>

<script setup lang="ts">
import type { AudioModule } from "~/types/modules/AudioModule";
import type { Control } from "~/types/tools/Control";
import { components } from "./index";

const { control, mod } = defineProps({
  control: {
    type: Object as PropType<Control>,
    required: true,
  },
  mod: {
    type: Object as PropType<AudioModule>,
    required: true,
  }
});

const component: ComputedRef<any> = computed(() => {
  return components[control.component]
})
</script>