<template>
<g :transform="`translate(${x} ${y})`">
  <foreignObject width="1" height="1" class="label-container">
    <span class="label-wrapper">pouet</span>
  </foreignObject>
  <line x1="10" y1="40" x2="10" y2="25" stroke="white" stroke-width="2" />
</g>
</template>

<script lang="ts" setup>
import type { AudioModule } from '~/types/modules/AudioModule';
import { RACK_HEIGHT, SLOT_SIZE } from '~/utils/constants';

const props = defineProps({
  mod: { type: Object as PropType<AudioModule>, required: true },
});

const x = computed(() => { return props.mod.slot * SLOT_SIZE + 10 });
const y = computed(() => { return props.mod.rack * RACK_HEIGHT - 40 });
</script>

<style scoped>
.label-container {
  overflow: visible;
}

.label-wrapper {
  font-size: 12px;
  white-space: nowrap;
  border: 2px solid white;
  padding: 3px 6px;
  box-sizing: border-box;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: #777777;
}
</style>