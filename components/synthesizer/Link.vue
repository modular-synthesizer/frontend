<script lang="ts">
import { mapActions } from "pinia";
import { PORT_RADIUS } from "~~/lib/utils/constants";
import Link from "~~/lib/wrappers/Link";
import Port from "~~/lib/wrappers/Port";

export default {
  props: {
    link: {
      type: Link,
      required: true
    }
  },
  computed: {
    r(): number {
        return PORT_RADIUS - 3
    },
    path(): string {
      const x1 = this.link.from.ax;
      const y1 = this.link.from.ay;
      const x2 = this.link.to.ax;
      const y2 = this.link.to.ay;
      return `M ${x2},${y2} Q ${this.cx},${this.cy} ${x1},${y1}`;
    },
    distance() {
      return Math.sqrt((this.link.from.ax - this.link.to.ax) ** 2 + (this.link.from.ay - this.link.to.ay) ** 2);
    },
    cx(): number {
      return Math.abs(this.link.to.ax + this.link.from.ax) / 2;
    },
    cy(): number {
      return Math.abs(this.link.to.ay + this.link.from.ay) / 2 + 0.5 * this.distance;
    }
  },
  methods: {
    ...mapActions(useLinksList, ['remove']),
    ...mapActions(useLinkDrag, ['magnetize', 'unmagnetize']),
    dragstart(port: Port, $event: MouseEvent) {
      useLinkDrag().dragstart(port, $event);
    },
  }
}
</script>

<template>
  <g>
    <path
      :d="path"
      :stroke="link.color"
      opacity="0.3"
      stroke-width="8"
      fill="none" 
      @click.prevent="remove(link.id)"
    />
    <circle
      :cx="link.from.ax"
      :cy="link.from.ay"
      :r="r"
      :stroke="link.color"
      stroke-width="6"
      fill="white"
      stroke-alignment="inner"
      @click.prevent="remove(link.id)"
      @mousedown.stop="dragstart(link.from, $event)"
      @mouseenter="magnetize(link.from)"
      @mouseout="unmagnetize()"
    />
    <circle
      :cx="link.to.ax"
      :cy="link.to.ay"
      :r="r"
      :stroke="link.color"
      stroke-width="6"
      fill="white"
      stroke-alignment="inner"
      @click.prevent="remove(link.id)"
      @mousedown.stop="dragstart(link.to, $event)"
      @mouseenter="magnetize(link.to)"
      @mouseout="unmagnetize()"
    />
  </g>
</template>