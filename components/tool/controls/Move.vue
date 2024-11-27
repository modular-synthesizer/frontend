<template>
  <g v-if="x && y" :transform="`translate(${x} ${y})`" @click="useControlSelection().selectControl(control)">
    <rect :x="-demiSize" :y="-demiSize" :height="size" :width="size" :stroke="stroke" stroke-width="2" fill="transparent" class="hoverable" />
    <path :stroke="stroke" stroke-width="2" :d="`M${-demiSize - 8} 0 H${demiSize + 8}`" class="hoverable" />
    <path :stroke="stroke" stroke-width="2" :d="`M0 ${-demiSize - 8} V${demiSize + 8}`" class="hoverable" />
  </g>
</template>

<script lang="ts" setup>
import { IControl } from '~~/lib/interfaces/IControl';

const { control, size } = defineProps({
  control: { type: Object as PropType<IControl>, required: true },
  size: { type: Number, default: 15 },
});

const { x, y } = control.payload;
const demiSize: number = size / 2;

const stroke = computed(() => (useControlSelection().selected.value.id === control.id ? 'red' : 'white'))
</script>

<style scoped>
.hoverable {
  cursor: pointer;
}
</style>