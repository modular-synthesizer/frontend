<template>
  <g>
    <text :x="port.x" :y="port.y - radius - 4" text-anchor="middle" class="port-label">{{ label }}</text>
    <g
      :transform="`translate(${port.x},${port.y})`"
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
        opacity="0"
        :r="radius"
        @mouseenter="magnetize(port)"
        @mouseout="unmagnetize()"
        @mousedown.stop.left="startLinkFrom(port)"
        @mouseup.stop.left="endLinkTo(port)"
      />
    </g>
  </g>
</template>

<script lang="ts">
import { mapActions } from 'pinia';
import { PropType } from 'vue';
import { useLinkDrag } from '~~/lib/stores/links/dragAndDrop';
import { PORT_RADIUS } from '~~/lib/utils/constants';
import PortWrapper from '~~/lib/wrappers/Port';

export default {
  data: () => ({
    radius: PORT_RADIUS
  }),
  methods: {
    ...mapActions(useLinkDrag, ['startLinkFrom', 'endLinkTo', 'magnetize', 'unmagnetize']),
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
  },
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