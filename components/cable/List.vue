<template>
  <g v-for="cable in cables" @click.right.stop.prevent="showContext($event, cable)">
    <cable-between-ports v-bind="cable" />
  </g>
</template>

<script setup lang="ts">
import type { Cable } from '~/types/Cable';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import { deleteCable } from '~/utils/functions/cables';

const { cables } = defineProps({
  cables: { type: Array<Cable>, default: () => [] },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});

function showContext($event: MouseEvent, cable: Cable) {
  useContexts().display($event, {
    items: [
      { label: 'link.remove', action: (c: Cable) => deleteCable(c, cables) },
    ],
    payload: cable
  })
}
</script>