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

const { cables } = defineProps<{ cables: Cable[] }>();

const adapter = inject(CABLES) as CablesAdapter

const changeColor = (color: CableColor) => (cable: Cable) => adapter.recolor(cable, color)

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