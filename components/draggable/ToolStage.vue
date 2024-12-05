<template>
  <div
    @mousemove="moveControl"
    @mouseleave.stop.prevent="useControlSelection().reset(tool)"
    @mouseup.stop.prevent="useControlSelection().reset(tool)"
    @click="useContexts().hide()"
  >
  <svg>
    <g :transform="`scale(${scale} ${scale}) translate(${x} ${y})`">
      <slot></slot>
    </g>
    <g v-if="selection" transform="translate(10 10)">
      <text :class="['fill-grey-lighten-2', 'stroke-grey-lighten-1']">X : {{ selection?.payload.x }}</text>
      <text y="20" :class="['fill-grey-lighten-2', 'stroke-grey-lighten-1']">Y : {{ selection?.payload.y }}</text>
    </g>
  </svg>
</div>
</template>

<script setup lang="ts">
import { clamp } from 'lodash';
import { IControl } from '~~/lib/interfaces/IControl';
import ITool from '~~/lib/interfaces/ITool';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';

const { x, y, scale, tool } = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  scale: { type: Number, default: 1 },
  tool: {type: Object as PropType<ITool>, required: true }
});

const emit = defineEmits<{ move: [ IControl ]}>();

const selection = computed(() => useControlSelection().selected.value);

function roundBy(value: number, round: number, max: number) {
  const v: number = Math.floor(value);
  return clamp(v - v % round, 0, max);
}

function moveControl($event: MouseEvent) {
  const control: IControl|undefined = useControlSelection().selected.value;
  if (control === undefined) return;
  const { ax, ay } = {
    ax: ($event.clientX / 1.5 - 50),
    ay: (($event.clientY - 48) / 1.5 - 50),
  };
  const { x: ox, y: oy } = useControlSelection().origin.value;
  control.payload.x = roundBy(ax - ox, 5, tool.slots * SLOT_SIZE);
  control.payload.y = roundBy(ay - oy, 5, RACK_HEIGHT);
  emit('move', control);
}
</script>

<style scoped>
svg {
  height: calc(100vh - 140px);
  width: 100%;
}
</style>