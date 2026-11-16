<template>
  <text :y="- r - 4" text-anchor="middle" class="port-label fill-shades-black stroke-grey-darken-1" font-size="10px">
    {{ label }}
  </text>
  <g>
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

    <Teleport to="#forefront">
      <!-- element sur lequel faire les mouseenter/mouseout -->
      <circle
        class="port-event-handler drag-starter"
        fill-opacity="0"
        :r="r"
        :cx="eventX"
        :cy="eventY"
        @mouseenter="cablesAdapter.magnetize(port)"
        @mouseout="cablesAdapter.unmagnetize(port)"
        @mousedown.left.stop="cablesAdapter.start(port)"
      />
    </Teleport>
  </g>
</template>

<script lang="ts" setup>
import type { DragCallback } from '~/types/draggables/DragDeclaration';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Port } from '~/types/modules/Port';
import type { ModControl } from "~/types/blueprints/Control";
import { isInput } from '~/utils/functions/ports';
import { CABLES } from '~/features/synthesizers/shared/Constants';
import { portPosition, type CablesAdapter } from '~/features/cables/shell/legacy/cables.adapter';

const cablesAdapter = inject(CABLES) as CablesAdapter

const { control, module } = defineProps({
  control: { type: Object as PropType<ModControl>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
  dropped: { type: Function as DragCallback, required: true }
});

const label: string = `${control.payload.label ?? ''}`
const r: number = PORT_RADIUS * 2;
const port: Port = module.ports.find((p: Port) => p.name === control.payload.target) as Port;
const color: string = isInput(port) ? 'grey' : 'indigo';

const eventX: ComputedRef<number> = computed(() => portPosition(port).x)
const eventY: ComputedRef<number> = computed(() => portPosition(port).y)
</script>

<style scoped>
.port-label {
  font-size: 9px;
  user-select: none;
  paint-order: stroke;
}
.port-event-handler {
  pointer-events: all;
}
</style>