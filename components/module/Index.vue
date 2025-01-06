<template>
  <rect :x="0" :y="0" :height="RACK_HEIGHT" :width="module.slots * SLOT_SIZE" fill="silver" />
  <template v-for="control in module.controls">
    <controls-wrapper :control="control" :mod="module" />
  </template>
</template>

<script setup lang="ts">
import { RACK_HEIGHT, SLOT_SIZE } from '~/lib/utils/constants';
import type { AudioModule } from '~/types/modules/AudioModule';

const { module } = defineProps({
  module: { type: Object as PropType<AudioModule>, required: true }
});
</script>