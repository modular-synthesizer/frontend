<template>
  <g :transform="`translate(${x} ${y})`">
    <rect :width="width" :height="height" stroke="black" fill="#A3A3A3" />
  </g>
</template>

<script lang="ts">
import IModule from '~~/lib/interfaces/IModule';
import { PropType } from 'vue'
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';

export default {
  name: "module-body",
  props: {
    mod: {
      type: Object as PropType<IModule>,
      required: true
    }
  },
  computed: {
    x() { return this.mod.slot * SLOT_SIZE },
    y() { return this.mod.rack * RACK_HEIGHT },
    width() { return this.mod.slots * SLOT_SIZE },
    height() { return RACK_HEIGHT }
  }
}
</script>
