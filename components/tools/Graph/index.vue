<template>
  <draggable-stage :position="position">
    <g v-for="node in tool.nodes" :key="node.id" :transform="`translate(${node.x} ${node.y})`">
      <tools-graph-node :node="node" :nodes="tool.nodes" :tool="tool" />
    </g>
  </draggable-stage>
</template>

<script lang="ts" setup>
import ITool from "~~/lib/interfaces/ITool";
import { ScalablePosition } from "@/lib/types/ScalablePosition"

const { tool } = defineProps<{tool: ITool}>();
const position: ScalablePosition = reactive({ x: 100, y: 0, scale: 1 })

</script>

<style scoped>
svg {
  height: calc(100vh - 150px);
  width: 100%;
}
</style>