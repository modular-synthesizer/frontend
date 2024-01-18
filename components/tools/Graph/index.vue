
import loginVue from '~~/pages/login.vue';
<template>
  <svg class="tool-graph">
    <tools-graph-node v-for="node in tool.nodes" :node="node" :key="node.id" />
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