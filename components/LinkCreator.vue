<template>
  <g v-if="start">
    <Connection :start-x="start.ax" :start-y="start.ay" :end-x="endX" :end-y="endY" :color="color" :no-events="true" />
  </g>
</template>

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

<style scoped>
.link-dot, .link-line {
  pointer-events: none;
}
</style>