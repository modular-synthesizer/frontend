<template>
  <g v-for="cable in cables" @click.right.capture.stop.prevent="showContext($event, cable)" @mouseup.capture.stop>
    <cable-between-ports v-bind="cable" />
  </g>
</template>

<script setup lang="ts">
import type { Cable } from '~/types/Cable';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import { deleteCable } from '~/utils/functions/cables';

const { cables, synthesizer } = defineProps({
  cables: { type: Array<Cable>, default: () => [] },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});

type Color = "red"|"blue"|"green"|"yellow"

function changeColor(color: Color) {
  return (cable: Cable) => {
    cable.color = color
    api_put(`/proxy/links/${cable.id}?synthesizer_id=${synthesizer.id}`, { color })
  }
}

function showContext($event: MouseEvent, cable: Cable) {
  useContexts().display($event, {
    items: [
      { label: 'link.remove', action: (c: Cable) => deleteCable(c, cables) },
      { label: 'colors.blue', action: changeColor("blue") },
      { label: 'colors.green', action: changeColor("green") },
      { label: 'colors.red', action: changeColor("red") },
      { label: 'colors.yellow', action: changeColor("yellow") },
    ],
    payload: cable
  })
}
</script>