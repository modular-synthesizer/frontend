<template>
  <cable-between-ports v-for="cable in cables" v-bind="cable" />
  <template v-if="isLinking()">
    <cable :start="linkStrategy.origin" :end="linkStrategy.destination" color="purple" />
  </template>
</template>

<script setup lang="ts">
import type { Cable } from '~/types/Cable';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import type { IStrategy } from '~/utils/draggables/IStrategy';
import type { LinkCreationStrategy } from '~/utils/draggables/LinkCreationStrategy';

const { cables, strategy } = defineProps({
  strategy: { type: Object as PropType<IStrategy> },
  cables: { type: Array<Cable>, default: () => [] },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});

function isLinking(): Boolean {
  return strategy?.constructor.name === 'LinkCreationStrategy'
};

const linkStrategy: ComputedRef<LinkCreationStrategy> = computed(() => {
  return strategy as LinkCreationStrategy;
})
</script>