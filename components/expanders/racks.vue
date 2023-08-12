<template>
  <g :transform="`translate(${synthesizer.slots * slotSize / 2 - 25}, ${synthesizer.racks * rackHeight + slotSize})`">
    <polygon class="expander" points="0,0 50,0 25,25" fill="#666666" stroke="white" stroke-width="3" @click="expand" />
  </g>
</template>

<script lang="ts">
import { api } from '~~/lib/api/Api';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import Rack from '~~/lib/wrappers/Rack';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

export default {
  props: {
    synthesizer: {
      type: Synthesizer,
      required: true,
    },
  },
  computed: {
    slotSize(): number { return SLOT_SIZE; },
    rackHeight(): number { return RACK_HEIGHT; },
  },
  methods: {
    async expand() {
      await api.auth_put(`/synthesizers/${this.synthesizer.id}`, {racks: this.synthesizer.racks + 1});
      this.synthesizer.racks.push(new Rack(this.synthesizer.racks, this.synthesizer.slots));
    }
  }
}
</script>

<style scoped lang="scss">
.expander {
  cursor: pointer;
}
</style>