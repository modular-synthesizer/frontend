<template>
    <text :x="x" :y="y - r - 4" text-anchor="middle" class="port-label fill-shades-black stroke-grey-darken-1" font-size="10px">{{ label }}</text>
    <g :transform="`translate(${x},${y})`" @mousedown.left.stop="onmousedown">
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

      <!-- element sur lequel faire les mouseenter/mouseout -->
      <circle
        class="port-event-handler"
        fill-opacity="0"
        fill="white"
        :r="r"
        @mouseenter="emit('mouseenter', $event)"
        @mouseout="emit('mouseout', $event)"
      />
    </g>
</template>

<script lang="ts" setup>
import type { OptionMergeFunction } from 'vue';
import type { DragDeclaration } from '~/types/draggables/DragDeclaration';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Port } from '~/types/modules/Port';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import type { Control } from '~/types/tools/Control';
import { LinkCreationStrategy } from '~/utils/draggables/LinkCreationStrategy';
import { isInput } from '~/utils/functions/ports';

const { click, control, module, synthesizer } = defineProps({
  control: { type: Object as PropType<Control>, required: true },
  click: { type: Function as PropType<DragDeclaration>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});

const label: string = `${control.payload.label ?? ''}`
const r: number = PORT_RADIUS * 2;
const port: Port = module.ports.find((p: Port) => p.name === control.payload.target) as Port;
const color: string = isInput(port) ? 'grey' : 'indigo';
const x: number = +control.payload.x;
const y: number = +control.payload.y;

function onmousedown($event: MouseEvent) {
  click(new LinkCreationStrategy(control, port, synthesizer, onCreation), $event)
}

function onCreation(origin: Port, destination: Port) {
  emit('linkCreated', origin, destination)
}

type Emits = {
  mouseenter: [ MouseEvent ],
  mouseout: [ MouseEvent ]
  linkCreated: [ Port, Port ]
}

const emit = defineEmits<Emits>();
</script>

<style scoped>
.port-label {
  font-size: 9px;
  user-select: none;
  paint-order: stroke;
}
</style>