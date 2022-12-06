<script lang="ts">
import { SLOT_SIZE } from '~~/lib/utils/constants';

export default {
  props: {
    y: {
      type: Number,
      required: true
    }
  },
  computed: {
    slotSize() { return SLOT_SIZE }
  }
}
</script>

<template>
  <g class="screws" :transform="`translate(0 ${y})`">
    <rect x="0" y="0" :width="slotSize" :height="slotSize" fill="silver" stroke="black" />
    <circle :cx="slotSize / 2" :cy="slotSize / 2" :r="slotSize / 4" fill="#555555" />
  </g>
</template>