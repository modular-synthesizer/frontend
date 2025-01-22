<template>
  <rect :x="0" :y="0" :height="module.height" :width="module.width" fill="silver" />
  <slot></slot>
</template>

<script setup lang="ts">
import type { AudioModule } from '~/types/modules/AudioModule';

const { module } = defineProps({
  module: { type: Object as PropType<AudioModule>, required: true }
});
</script>