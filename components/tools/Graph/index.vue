
import loginVue from '~~/pages/login.vue';
<template>
  <svg
    class="tool-graph"
    @mouseup.prevent.stop="startInnerNodeDrag"
    @mouseout.prevent.stop="startInnerNodeDrag"
  >
    <g transform="translate(20 0)">
      <g v-for="node in tool.nodes" :key="node.id" :transform="`translate(${node.x} ${node.y})`">
        <tools-graph-node :node="node" />
      </g>
    </g>
  </svg>
</template>

<script lang="ts" setup>
import ITool from "~~/lib/interfaces/ITool";
const { tool } = defineProps<{tool: ITool}>();

</script>

<style scoped>
svg.tool-graph {
  height: calc(100vh - 150px);
  width: 100%;
}
</style>