<template>
  <circle r="20" :cx="x" :cy="y" fill="white" stroke="black" stroke-width="3" />
</template>

<script lang="ts">
import { SLOT_SIZE } from '~~/lib/utils/constants';

export default {
  name: "Knob",
  props: {
    dx: {
      type: Number, default: 0
    },
    dy: {
      type: Number, default: 0
    }
  },
  computed: {
    x(): number {
      return this.dx * (SLOT_SIZE / 2)
    },
    y(): number {
      return this.dy * (SLOT_SIZE / 2)
    },
  },
}
</script>