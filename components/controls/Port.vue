<template>
  <g>
    <text :x="x" :y="y - radius - 4" text-anchor="middle" class="port-label">{{ label }}</text>
    <g
      :transform="`translate(${x},${y})`"
      @mousedown.stop
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
      <circle opacity="0" :r="radius" />
    </g>
  </g>
</template>

<script lang="ts">import { PropType } from 'vue';
import { PORT_RADIUS, SLOT_SIZE } from '~~/lib/utils/constants';
import PortWrapper from '~~/lib/wrappers/Port';

export default {
  name: "Port",
  data: () => ({
    radius: PORT_RADIUS
  }),
  computed: {
    x(): number {
      return this.dx * (SLOT_SIZE / 2)
    },
    y(): number {
      return this.dy * (SLOT_SIZE / 2)
    }
  },
  props: {
    port: {
      type: Object as PropType<PortWrapper>,
      required: true
    },
    fillColor: {
      type: String,
      default: "#555555"
    },
    strokeColor: {
      type: String,
      default: "black"
    },
    label: {
      type: String,
      default: ""
    },
    dx: {
      type: Number, default: 0
    },
    dy: {
      type: Number, default: 0
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