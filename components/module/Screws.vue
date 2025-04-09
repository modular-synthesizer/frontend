<template>
  <g>
    <module-screw :y="shift" :x="shift" />
    <module-screw :y="shift" :x="width - shift" />
    <module-screw :y="height - shift" :x="shift" />
    <module-screw :y="height - shift" :x="width - shift" />
  </g>
</template>

<script lang="ts">
import { RACK_HEIGHT, SLOT_SIZE } from '~/utils/constants';

export default {
  props: {
    slots: { type: Number, required: true }
  },
  computed: {
    width() {
      return this.slots * SLOT_SIZE;
    },
    height() {
      return RACK_HEIGHT;
    },
    shift() {
      return SLOT_SIZE / 2;
    },
  },
}
</script>