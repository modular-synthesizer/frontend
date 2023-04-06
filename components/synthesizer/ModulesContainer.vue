<template>
  <g :transform="`translate(${dx} ${dy}) scale(${dscale} ${dscale})`">
    <slot></slot>
  </g>
</template>

<script lang="ts">
import Synthesizer from '~~/lib/wrappers/Synthesizer';
import { useDisplay } from 'vuetify'
import { RACK_HEIGHT } from '~~/lib/utils/constants';

export default {
  props: {
    synthesizer: {
      type: Synthesizer,
      required: true
    }
  },
  computed: {
    mobile() { return useDisplay().mobile.value; },
    dx() {
      return this.mobile ? 0 : this.synthesizer.x;
    },
    dy() {
      return this.mobile ? 0 : this.synthesizer.y;
    },
    dscale() {
      if (!this.mobile) return 1;
      return Math.min(window.innerHeight, window.innerWidth) / RACK_HEIGHT;
    },
  },
}
</script>