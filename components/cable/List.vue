<template>
  <cable-between-ports v-for="cable in cables" v-bind="cable" />
  <template v-if="isLinking()">
    <cable :start="linkStrategy.origin" :end="linkStrategy.destination" />
  </template>
</template>

<script setup lang="ts">
import type { Cable, LinkPayload } from '~/types/Cable';
import type { Port } from '~/types/modules/Port';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import type { IStrategy } from '~/utils/draggables/IStrategy';
import type { LinkCreationStrategy } from '~/utils/draggables/LinkCreationStrategy';
import { getPort } from '~/utils/functions/ports';

const { links, strategy, synthesizer } = defineProps({
  strategy: { type: Object as PropType<IStrategy> },
  links: { type: Array<LinkPayload>, default: () => [] },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});

const cables: ComputedRef<Array<Cable>> = computed((): Array<Cable> => {
  return links.map((link: LinkPayload) => {
    const from: Port = getPort(link.from, synthesizer.modules) as Port;
    const to: Port = getPort(link.to, synthesizer.modules) as Port;
    return { id: link.id, color: link.color, from, to };
  });
});

function isLinking(): Boolean {
  return strategy?.constructor.name === 'LinkCreationStrategy'
};

const linkStrategy: ComputedRef<LinkCreationStrategy> = computed(() => {
  return strategy as LinkCreationStrategy;
})
</script>