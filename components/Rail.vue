<template>
  <g>
    <g v-for="slot in slots" :transform="`translate(${slotSize * (slot - 1)} 0)`">
      <Fixation />
    </g>
    <rect x="0" y="0" :width="slots * slotSize" :height="slotSize" fill="transparent" stroke="#333333" />
  </g>
</template>

<script lang="ts">
import { SLOT_SIZE } from '~~/lib/utils/constants';
import Fixation from "~~/components/synthesizer/Fixation.vue"

export default {
  props: {
    slots: {
      type: Number,
      required: true,
    }
  },
  computed: {
    slotSize() { return SLOT_SIZE; }
  },
  components: {
    Fixation
  }
}
</script>