<template>
  <g :transform="`translate(0 ${rackHeight * rack.index})`">
    <g v-for="slot in rack.slots" :transform="`translate(${slotSize * (slot - 1)} 0)`">
      <Fixation :y="0" />
      <Fixation :y="rackHeight - slotSize" />
    </g>
    <ExpandersSlots :rack="rack" />
  </g>
</template>

<script lang="ts">
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import Rack from '~~/lib/wrappers/Rack';
import Fixation from './Fixation.vue';

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
  components: { Fixation }
}
</script>
