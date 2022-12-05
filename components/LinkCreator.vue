<script lang="ts">
import { PORT_RADIUS } from '~~/lib/utils/constants';
import { mapState } from 'pinia';

export default  {
  computed: {
    ...mapState(useLinkDrag, ['coords', 'start', 'magnet']),
    ...mapState(useSynthesizerDetails, ['synthesizer']),
    radius(): number {
      return PORT_RADIUS - 3
    },
    endX() {
      if (useLinkDrag().magnet !== null) return useLinkDrag().magnet?.ax;
      return (useLinkDrag().coords.x - this.synthesizer.x) / this.synthesizer.scale
    },

    endY() {
      if (this.magnet) return this.magnet.ay;
      return (this.coords.y - this.synthesizer.y) / this.synthesizer.scale
    },

    color(): string {
      return "#333333"
    }
  },
}
</script>

<template>
  <g v-if="start">
    <line class="link-line" :x1="start.ax" :x2="endX" :y1="start.ay" :y2="endY" stroke-width="8" :stroke="color" opacity="0.5" />
    <circle class="link-dot" :cx="start.ax" :cy="start.ay" :r="radius" fill="white" stroke-width="6" :stroke="color" />
    <circle class="link-dot" :cx="endX" :cy="endY" :r="radius" fill="white" stroke-width="6" :stroke="color" />
  </g>
</template>

<style scoped>
.link-dot, .link-line {
  pointer-events: none;
}
</style>