<template>
  <g>
    <path
      :d="path"
      :opacity="entered ? 1 : opacity"
      stroke-width="7"
      :class="[`stroke-${color}-darken-3`]"
      v-if="showCable"
      fill="transparent"
    />
    <circle
      :class="[`stroke-${color}-darken-3 fill-shades-white`]"
      :cx="start.x"
      :cy="start.y"
      :r="r"
      stroke-width="6"
    />
    <circle
      :class="[ `stroke-${color}-darken-3 fill-shades-white`]"
      :cx="end.x"
      :cy="end.y"
      :r="r"
      stroke-width="6"
      @mouseup="useLinkCreation().end()"
    />
  </g>
</template>

<script lang="ts">
import type { Coordinates } from '~/types/utils/Coordinates';
import { PORT_RADIUS } from '~/utils/constants';
import { getCatenaryCurve, type CatenaryCurveQuadraticResult as Curve } from "catenary-curve";

export default {
  emits: ['click'],
  props: {
    start: { type: Object as PropType<Coordinates>, required: true },
    end: { type: Object as PropType<Coordinates>, required: true },
    color: { type: String, default: '#5E35B1' },
    opacity: { type: Number, default: 0.3 },
    noEvents: { type: Boolean },
    showCable: { type: Boolean, default: true },
  },
  data: () => ({
    entered: false,
    moved: false,
  }),
  computed: {
    r(): number {
        return 2 * PORT_RADIUS - 2
    },
    path(): string {
      const curve: Curve = getCatenaryCurve(this.start, this.end, this.distance * 1.6) as Curve;
      let path = `M ${curve.start[0]} ${curve.start[1]} `;
      for (const part of curve.curves) path += `Q ${part[0]} ${part[1]}, ${[part[2]]} ${part[3]}`;
      return path;
    },
    distance() {
      return Math.sqrt((this.start.x - this.end.x) ** 2 + (this.start.y - this.end.y) ** 2);
    },
    cx(): number {
      return (this.end.x + this.start.x) / 2
    },
    cy(): number {
      const dangle: number = Math.min(this.distance, 125) + 0.5 * Math.abs(this.start.y - this.end.y)
      return (this.end.y + this.start.y) / 2 + dangle;
    }
  },
}
</script>

<style scoped>
.no-events {
  pointer-events: none;
}

.path {
  opacity: 0.35;
}

.path.entered {
  opacity: 1;
}
</style>