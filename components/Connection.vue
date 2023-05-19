<template>
  <g @mouseenter="entered = true" @mouseout="entered = false" @mousemove="moved = true">
    <path
      :d="path"
      :stroke="color"
      :opacity="entered ? 1 : opacity"
      stroke-width="6"
      fill="none"
      :class="{ 'no-events': noEvents }"
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
      @mousedown.left.stop="startMouseDown"
      @mouseenter="startMouseEnter"
      @mouseout="mouseOut"
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
      @mousedown.left.stop="endMouseDown"
      @mouseenter="endMouseEnter"
      @mouseout="mouseOut"
    />
  </g>
</template>

<script lang="ts">
import { PORT_RADIUS } from '~~/lib/utils/constants';

export default {
  emits: ['click', 'startMousedown', 'endMousedown', 'startMouseenter', 'endMouseenter', 'mouseout'],
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
        return PORT_RADIUS - 3
    },
    path(): string {
      return `M ${this.endX},${this.endY} Q ${this.cx},${this.cy} ${this.startX},${this.startY}`;
    },
    distance() {
      return Math.sqrt((this.startX - this.endX) ** 2 + (this.startY - this.endY) ** 2);
    },
    cx(): number {
      return Math.abs(this.endX + this.startX) / 2;
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
    startMouseDown($event: MouseEvent) {
      this.moved = false;
      this.$emit('startMousedown', $event);
    },
    endMouseDown($event: MouseEvent) {
      this.moved = false;
      this.$emit('endMousedown', $event);
    },
    startMouseEnter() {
      this.$emit('startMouseenter');
    },
    endMouseEnter() {
      this.$emit('endMouseenter');
    },
    mouseOut() {
      this.$emit('mouseout');
    }
  }
}
</script>

<style scoped>
.no-events {
  pointer-events: none;
}
</style>