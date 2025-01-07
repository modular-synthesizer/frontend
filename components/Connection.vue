<template>
  <g :class="{'no-events': linkCreationState.display}">
    <path
      :d="path"
      :opacity="entered ? 1 : opacity"
      stroke-width="7"
      :class="[{ 'no-events': noEvents, path: true, entered }, 'stroke-purple-darken-3']"
      @click.prevent="click(true)"
      v-if="showCable"
      fill="transparent"
    />
    <circle
      :class="[{ 'no-events': noEvents }, 'stroke-purple-darken-3 fill-shades-white']"
      :cx="start.x"
      :cy="start.y"
      :r="r"
      stroke-width="6"
      @click="click()"
      @mouseenter.stop
    />
    <circle
      :class="[{ 'no-events': noEvents }, 'stroke-purple-darken-3 fill-shades-white']"
      :cx="end.x"
      :cy="end.y"
      :r="r"
      stroke-width="6"
      @click.prevent="click()"
      @mouseenter.stop
    />
  </g>
</template>

<script lang="ts">
import type { Coordinates } from '~/types/utils/Coordinates';
import { PORT_RADIUS } from '~~/lib/utils/constants';

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
      return Math.abs(this.end.y + this.start.y) / 2 + dangle;
    }
  },
  methods: {
    click(force: boolean = false) {
      if(this.moved && !force) return;
      this.$emit('click');
    },
  }
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