<template>
  <g v-if="port">
    <text :x="x" :y="y - radius - 4" text-anchor="middle" class="port-label fill-shades-black stroke-grey-darken-1" font-size="10px">{{ label }}</text>
    <g
      :transform="`translate(${x},${y})`"
    >
      <circle
        :r="radius"
        :class="colorClass"
        stroke-width="2"
        :stroke="strokeColor"
      />
      <circle :r="radius - 4" stroke-width="2" stroke="white" />
      <line :x1="3 - radius" :x2="radius - 3" :class="strokeClass" stroke-width="2" />
      <circle :r="radius - 5" :class="colorClass" />
      <circle :r="radius - 7" stroke-width="2" stroke="white" />
      <circle :r="radius - 8" />
      <circle
        class="port-event-handler"
        fill-opacity="0"
        fill="white"
        :r="radius"
        @mouseenter="magnetize(port)"
        @mouseout="unmagnetize()"
        @mousedown.left.stop="startLinkCreation(port, $event)"
      />
    </g>
  </g>
</template>

<script lang="ts">
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Port } from '~/types/modules/Port';
import { isInput } from '~/utils/functions/ports';
import { PORT_RADIUS } from '~~/lib/utils/constants';

export default {
  name: 'controls-port',
  data: () => ({
    radius: PORT_RADIUS
  }),
  props: {
    mod: {
      type: Object as PropType<AudioModule>, required: true
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
    colorClass() {
      const input: boolean = isInput(this.port);
      return { 'fill-grey-darken-3': input, 'fill-indigo-darken-3': !input };
    },
    strokeClass() {
      const input: boolean = isInput(this.port)
      return { 'stroke-grey-darken-3': input, 'stroke-indigo-darken-3': !input };
    }
  },
}
</script>

<style scoped>
.port-label {
  font-size: 9px;
  user-select: none;
  paint-order: stroke;
}
</style>