<template>
  <g :transform="`translate(${(rack.slots + 1) * slotSize} ${rackHeight / 2 - 25})`">
    <polygon class="expander" points="0,0 0,50 25,25" fill="#666666" stroke="white" stroke-width="3" @click="expand" />
  </g>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { api } from '~~/lib/api/Api';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import Rack from '~~/lib/wrappers/Rack';

export default {
  props: {
    rack: {
      type: Rack,
      required: true
    }
  },
  computed: {
    slotSize(): number { return SLOT_SIZE; },
    rackHeight(): number { return RACK_HEIGHT; },
    ...mapState(useSynthesizerDetails, ['synthesizer'])
  },
  methods: {
    async expand() {
      await api.auth_put(`/synthesizers/${this.synthesizer.id}`, {slots: this.synthesizer.slots + 20});
      this.synthesizer.slots = this.synthesizer.slots + 20;
      this.synthesizer.racks.forEach(rack => {
        rack.slots = rack.slots + 20;
      });
    }
  }
}
</script>

<style scoped lang="scss">
.expander {
  cursor: pointer;
}
</style>