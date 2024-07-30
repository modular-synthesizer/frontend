<template>
  <div class="super-wrapper">
    <svg>
      <tool-structure-background @move="seeMove" @start="selectItem(null)" />
      <g :transform="`translate(${x} ${y})`">
        <tool-structure-node
          v-for="node in tool.nodes"
          :node="node"
          :selected="node.id === selected?.id"
          @select="selectItem"
          @moveSelected="moveSelected"
          :tool="tool"
        />
        <tool-structure-link v-for="link in tool.links" :link="link" :tool="tool" />
        <rect
          :x="selected.x"
          :y="selected.y"
          :height="getNodeHeight(selected, tool)"
          width="180"
          fill="transparent"
          stroke="red"
          stroke-width="5"
          v-if="selected"
        />
        <tool-structure-port v-for="port in tool.ports" :port="port" :tool="tool" />
      </g>
    </svg>
    <tool-structure-menu :tool="tool" />
  </div>
</template>

<script setup lang="ts">
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
});

const selected: Ref<InnerNode|null> = ref(null);

const x: Ref<number> = ref(100);
const y: Ref<number> = ref(100);

function seeMove(cx: number, cy: number) {
  x.value = cx; y.value = cy;
}

function moveSelected(x: number, y: number) {
  if (selected.value !== null) {
    selected.value.x = x;
    selected.value.y = y
  }
}

function selectItem(node: InnerNode|null) {
  selected.value = node;
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