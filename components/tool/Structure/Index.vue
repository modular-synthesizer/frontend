<template>
  <div class="super-wrapper">
    <svg>
      <tool-structure-background @move="seeMove" @start="triggerBackgroundCallbacks" />
      <g :transform="`translate(${x} ${y})`">
        <tool-structure-node-list :tool="tool" />
        <tool-structure-link-list :tool="tool" />
        <tool-structure-port v-for="port in tool.ports" :port="port" :tool="tool" />
      </g>
    </svg>
    <tool-structure-menu :tool="tool" />
  </div>
</template>

<script setup lang="ts">
import { triggerBackgroundCallbacks } from '~~/composables/tools/structure';
import ITool from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
});

const x: Ref<number> = ref(100);
const y: Ref<number> = ref(100);

function seeMove(cx: number, cy: number) {
  x.value = cx; y.value = cy;
}
</script>

<style>
.super-wrapper {
  border: 1px solid white;
  height: calc(100vh - 64px);
}

.super-wrapper > header {
  border: 1px solid white;
  border-bottom: none;
}

svg {
  height: 100%;
  width: 100%;
}
</style>