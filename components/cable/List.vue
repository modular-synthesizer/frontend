<template>
  <cable-between-ports v-for="cable in cables" v-bind="cable" />
</template>

<script setup lang="ts">
import type { Cable } from '~/types/Cable';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';

const { cables } = defineProps({
  cables: { type: Array<Cable>, default: () => [] },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});
</script>