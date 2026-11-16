<template>
  <g
    v-for="cable in cables"
    :key="`${cable.origin.id}:${cable.destination.id}`"
    @click.right.capture.stop.prevent="showContext($event, cable)"
    @mouseup.capture.stop
  >
    <cable-between-ports :cable="cable" />
  </g>
</template>

<script setup lang="ts">
import type { Cable, CableColor } from '~/features/cables/core/data/Cable.type';
import type { CablesAdapter } from '~/features/cables/shell/legacy/cables.adapter';
import { CABLES } from '~/features/synthesizers/shared/Constants';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';

const { cables, synthesizer } = defineProps({
  cables: { type: Array<Cable>, default: () => [] },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});

const adapter = inject(CABLES) as CablesAdapter

function changeColor(color: CableColor) {
  return (cable: Cable) => {
    cable.color = color
    api_put(`/proxy/links/${cable.id}?synthesizer_id=${synthesizer.id}`, { color })
  }
}

function showContext($event: MouseEvent, cable: Cable) {
  useContexts().display($event, {
    items: [
      { label: 'link.remove', action: (c: Cable) => adapter.remove(c) },
      { label: 'colors.blue', action: changeColor("blue") },
      { label: 'colors.green', action: changeColor("green") },
      { label: 'colors.red', action: changeColor("red") },
      { label: 'colors.yellow', action: changeColor("yellow") },
    ],
    payload: cable
  })
}
</script>