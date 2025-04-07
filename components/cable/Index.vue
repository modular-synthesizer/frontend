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
  data: function () {
    return {
      entered: false,
      moved: false,
    };
  },
  computed: {
    r(): number {
        return PORT_RADIUS - 2
    },
    path(): string {
      return `M ${this.end.x},${this.end.y} Q ${this.cx},${this.cy} ${this.start.x},${this.start.y}`;
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