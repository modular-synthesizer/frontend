<script lang="ts">
import { SLOT_SIZE } from '~~/lib/utils/constants';

export default {
  computed: {
    slotSize() { return SLOT_SIZE },
  }
}
</script>

<template>
  <g class="screws">
    <circle :cx="slotSize / 2" :cy="slotSize / 2" :r="slotSize / 4" fill="#333333" />
    <circle :cx="slotSize / 2" :cy="slotSize / 2" :r="slotSize / 4 - 2" fill="black" />
  </g>
</template>