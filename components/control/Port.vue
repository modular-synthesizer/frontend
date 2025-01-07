<template>
  <g>
    <text :x="x" :y="y - r - 4" text-anchor="middle" class="port-label fill-shades-black stroke-grey-darken-1" font-size="10px">{{ label }}</text>
    <g
      :transform="`translate(${x},${y})`"
    >
      <circle
        :r="r"
        :class="`fill-${color}-darken-3`"
        stroke-width="2"
        :stroke="`stroke-${color}-darken-3`"
      />
      <circle :r="r - 4" stroke-width="2" stroke="white" />
      <line :x1="3 - r" :x2="r - 3" :class="`stroke-${color}-darken-3`" stroke-width="2" />
      <circle :r="r - 5" :class="`fill-${color}-darken-3`" />
      <circle :r="r - 7" stroke-width="2" stroke="white" />
      <circle :r="r - 8" />
      <circle
        class="port-event-handler"
        fill-opacity="0"
        fill="white"
        :r="r"
        @mouseenter="magnetize(port)"
        @mouseout="unmagnetize()"
        @mousedown.left.stop="onmousedown"
      />
    </g>
  </g>
</template>

<script lang="ts" setup>
import type { DragDeclaration } from '~/types/draggables/DragDeclaration';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Port } from '~/types/modules/Port';
import type { Control } from '~/types/tools/Control';
import { LinkCreationStrategy } from '~/utils/draggables/LinkCreationStrategy';
import { isInput } from '~/utils/functions/ports';

const { click, control, module } = defineProps({
  control: { type: Object as PropType<Control>, required: true },
  click: { type: Function as PropType<DragDeclaration>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
});

const label: string = `${control.payload.label ?? ''}`
const r: number = PORT_RADIUS * 2;
const port: Port = module.ports.find((p: Port) => p.name === control.payload.target) as Port;
const color: string = isInput(port) ? 'grey' : 'indigo';
const x: number = +control.payload.x;
const y: number = +control.payload.y;

function onmousedown($event: MouseEvent) {
  click(new LinkCreationStrategy(control, port), $event)
}
</script>

<style scoped>
.port-label {
  font-size: 9px;
  user-select: none;
  paint-order: stroke;
}
</style>