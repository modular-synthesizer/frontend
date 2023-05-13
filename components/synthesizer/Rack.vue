<template>
  <g :transform="`translate(0 ${rackHeight * rack.index})`">
    <Rail :slots="rack.slots" />
    <g :transform="`translate(0 ${rackHeight - slotSize})`">
      <Rail :slots="rack.slots" />
    </g>
    <ExpandersSlots :rack="rack" />
  </g>
</template>

<script lang="ts">
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import Rack from '~~/lib/wrappers/Rack';
import Rail from '../Rail.vue'

export default {
  props: {
    rack: {
      type: Rack,
      required: true
    }
  },
  computed: {
    rackHeight() { return RACK_HEIGHT; },
    slotSize() { return SLOT_SIZE; }
  },
  components: { Rail }
}
</script>
