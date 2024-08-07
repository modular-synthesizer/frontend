<template>
  <circle v-if="props.port.kind === 'input'" :cx="target().x - 20" :cy="target().y + 20" r="10" fill="red" stroke="white" stroke-width="2" />
  <circle v-else :cx="target().x + 200" :cy="target().y + 20" r="10" fill="blue" stroke="white" stroke-width="2" />
</template>

<script setup lang="ts">
import IPort from '~~/lib/interfaces/IPort';
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';

const props = defineProps({
  port: { type: Object as PropType<IPort>, required: true },
  tool: { type: Object as PropType<ITool>, required: true }
})

function target(): InnerNode {
  return props.tool.nodes.find((n: InnerNode) => n.name === props.port.target) as InnerNode;
}
</script>