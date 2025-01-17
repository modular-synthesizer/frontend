<template>
  <component :is="component.default" :control="control" :mod="mod" v-bind="control.payload"/>
</template>

<script setup lang="ts">
import type { AudioModule } from "~/types/modules/AudioModule";
import type { Control } from "~/types/tools/Control";

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

const component = await import("./" + control.component + ".vue");
</script>