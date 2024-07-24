<template>
  <svg>
    <tool-structure-background @move="seeMove" @start="selectItem(null)" />
    <g :transform="`translate(${x} ${y})`">
      <tool-structure-node v-for="node in tool.nodes" :node="node" :selected="node.id === selected?.id" @select="selectItem" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
});

const selected: Ref<InnerNode|null> = ref(null);

const x: Ref<number> = ref(0);
const y: Ref<number> = ref(0);

function seeMove(cx: number, cy: number) {
  x.value = cx; y.value = cy;
}

function selectItem(node: InnerNode|null) {
  selected.value = node;
}
</script>

<style>
svg {
  border: 1px solid white;
  height: calc(100% - 10px);
  width: 100%;
}
</style>