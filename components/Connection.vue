<template>
  <g :class="{'no-events': linkCreationState.display}">
    <path
      :d="path"
      :stroke="color"
      :opacity="entered ? 1 : opacity"
      stroke-width="7"
      fill="none"
      :class="{ 'no-events': noEvents, path: true, entered }"
      @click.prevent="click(true)"
    />
    <circle
      :class="{ 'no-events': noEvents }"
      :cx="startX"
      :cy="startY"
      :r="r"
      fill="white"
      stroke-width="6"
      :stroke="color"
      @click="click()"
      @mouseenter.stop
    />
    <circle
      :class="{ 'no-events': noEvents }"
      :cx="endX"
      :cy="endY"
      :r="r"
      fill="white"
      stroke-width="6"
      :stroke="color"
      @click.prevent="click()"
      @mouseenter.stop
    />
  </g>
</template>

<script lang="ts">
import { PORT_RADIUS } from '~~/lib/utils/constants';

export default {
  emits: ['click'],
  props: {
    startX: { type: Number, default: 0 },
    startY: { type: Number, default: 0 },
    endX: { type: Number, default: 0 },
    endY: { type: Number, default: 0 },
    color: { type: String, default: '#5E35B1' },
    opacity: { type: Number, default: 0.3 },
    noEvents: { type: Boolean },
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
      return `M ${this.endX},${this.endY} Q ${this.cx},${this.cy} ${this.startX},${this.startY}`;
    },
    distance() {
      return Math.sqrt((this.startX - this.endX) ** 2 + (this.startY - this.endY) ** 2);
    },
    cx(): number {
      return (this.endX + this.startX) / 2
    },
    cy(): number {
      const dangle: number = Math.min(this.distance, 125) + 0.5 * Math.abs(this.startY - this.endY)
      return Math.abs(this.endY + this.startY) / 2 + dangle;
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