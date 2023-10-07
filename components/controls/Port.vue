<template>
  <g>
    <text :x="x" :y="y - radius - 4" text-anchor="middle" class="port-label">{{ label }}</text>
    <g
      :transform="`translate(${x},${y})`"
    >
      <circle
        :r="radius"
        :fill="fillColor"
        stroke-width="2"
        :stroke="strokeColor"
      />
      <circle :r="radius - 4" stroke-width="2" stroke="white" />
      <line :x1="3 - radius" :x2="radius - 3" :stroke="fillColor" stroke-width="2" />
      <circle :r="radius - 5" :stroke="fillColor" />
      <circle :r="radius - 7" stroke-width="2" stroke="white" />
      <circle :r="radius - 8" />
      <circle
        v-if="port?.free"
        opacity="0"
        :r="radius"
        @mouseenter="magnetize(port)"
        @mouseout="unmagnetize()"
        @mousedown.left.stop="dragstart"
      />
    </g>
  </g>
</template>

<script lang="ts">
import { mapActions } from 'pinia';
import { PORT_RADIUS } from '~~/lib/utils/constants';
import Mod from '~~/lib/wrappers/Mod';
import Port from '~~/lib/wrappers/Port';

export default {
  name: 'controls-port',
  data: () => ({
    radius: PORT_RADIUS
  }),
  methods: {
    ...mapActions(useLinkDrag, ['magnetize', 'unmagnetize']),
    dragstart($event: MouseEvent) {
      useLinkDrag().dragstart(this.port, $event);
    },
  },
  props: {
    mod: {
      type: Mod, required: true
    },
    strokeColor: {
      type: String,
      default: "black"
    },
    label: {
      type: String,
      default: ""
    },
    x: { type: Number, default: 0},
    y: { type: Number, default: 0},
    target: { type: String, required: true }
  },
  computed: {
    port() {
      return this.mod.ports.find(p => p.name === this.target) as Port;
    },
    fillColor() {
      if (this.port === undefined) return "#CC0000";
      return this.port.isInput() ? "#555555" : "#000099"
    }
  }
}
</script>

<style scoped>
text {
  user-select: none;
}
.port-label {
  font-size: 9px;
  user-select: none;
}
</style>