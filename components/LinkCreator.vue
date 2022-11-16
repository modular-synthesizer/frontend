<script lang="ts">
import Port from '~~/lib/wrappers/Port';

import { PropType } from "vue"
import { PORT_RADIUS } from '~~/lib/utils/constants';
import { useSynthesizerDetails } from '~~/lib/stores/synthesizers/details';
import { mapState } from 'pinia';
import { useLinkDrag } from '~~/lib/stores/links/dragAndDrop';

export default  {
  props: {
    port: {
      type: Object as PropType<Port>,
      required: true
    }
  },
  computed: {
    radius(): number {
      return PORT_RADIUS - 3
    },
    synth() {
      return useSynthesizerDetails().synthesizer
    },
    ...mapState(useLinkDrag, ['dragCoordinates', 'startPort', 'magnet']),

    endX() {
      if (this.magnet) return this.magnet.ax;
      return (this.dragCoordinates.x - this.synth.x) / this.synth.scale
    },

    endY() {
      if (this.magnet) return this.magnet.ay;
      return (this.dragCoordinates.y - this.synth.y) / this.synth.scale
    },

    color(): string {
      return "#333333"
    }
  }
}
</script>

<template>
  <g>
    <line class="link-line" :x1="startPort.ax" :x2="endX" :y1="startPort.ay" :y2="endY" stroke-width="8" :stroke="color" opacity="0.5" />
    <circle class="link-dot" :cx="startPort.ax" :cy="startPort.ay" :r="radius" fill="white" stroke-width="6" :stroke="color" />
    <circle class="link-dot" :cx="endX" :cy="endY" :r="radius" fill="white" stroke-width="6" :stroke="color" />
  </g>
</template>

<style scoped>
.link-dot, .link-line {
  pointer-events: none;
}
</style>