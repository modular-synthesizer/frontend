<template>
  <tool-structure-node v-for="node in nodes" :node="node" :tool="tool" @edit-port="(p: ToolPort) => emit('editPort', p)" @moved="moveNode" @moving="updateCoords" />
</template>

<script lang="ts" setup>
import type { Tool } from '~~/types/tools/Tool';
import type { ToolPort } from '~~/types/tools/Port';
import type { InnerNode } from '~/types/tools/InnerNode';
import { repositories } from '~/lib/repositories';
import type { Coordinates } from '~/types/utils/Coordinates';

const { tool } = defineProps({
  tool: { type: Object as PropType<Tool>, required: true }
});

const nodes: Ref<Array<InnerNode>> = ref(tool.nodes);

const emit = defineEmits<{ editPort: [ item: ToolPort ] }>();

function moveNode(node: InnerNode) {
  repositories.tool.nodes.update(tool, nodes.value, node);
}

function updateCoords(node: InnerNode, coordinates: Coordinates) {
  node.x = coordinates.x;
  node.y = coordinates.y;
}
</script>