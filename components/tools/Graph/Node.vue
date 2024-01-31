<template>
  <g
    @mousedown.prevent.stop="startInnerNodeDrag($event, node, tool, nodes)"
    class="inner-node"
  >
    <rect x="0" y="0" fill="white" :width="value.width" :height="value.height" />
    <text x="20" y="15" ref="input">{{node.name}}</text>
    
    <tools-graph-port v-for="input in node.inputs" :position="input" />
    <tools-graph-port v-for="output in node.outputs" :position="output" :dx="value.width" />
  </g>
</template>

<script lang="ts" setup>
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';
const { node } = defineProps<{node: InnerNode, tool: ITool, nodes: InnerNode[]}>();
const input: Ref<any> = ref(null);

const ports: number = Math.max(node.inputs, node.outputs);
const height: number = ports * 25 + 5

const value = reactive({width: 0, height});

watch(input, ({ clientWidth }) => {
  value.width = clientWidth + 20;
});
</script>

<style scoped>
.inner-node {
  user-select: none;
}
</style>