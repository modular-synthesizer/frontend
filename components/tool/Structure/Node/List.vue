<template>
  <template v-for="node in tool.nodes">
    <tool-structure-node
      v-if="node.id !== selection.item?.id"
      :node="node"
      :selected="false"
      @select="selection.select(node)"
      :tool="tool"
      @edit-port="editPort"
    />
  </template>
  <tool-structure-node
    v-if="selection.item"
    :node="selection.item"
    :selected="true"
    :tool="tool"
    @edit-port="editPort"
  />
</template>

<script lang="ts" setup>
import type { Tool } from '~~/types/tools/Tool';
import type { ToolPort } from '~~/types/tools/Port';
import { repositories } from '~/lib/repositories';
import type { InnerNode } from '~/types/tools/InnerNode'
import { find } from 'lodash';

const { tool } = defineProps({
  tool: { type: Object as PropType<Tool>, required: true }
});

const selection = ref(useSelectables().state.value.nodes);

const emit = defineEmits<{ editPort: [ item: ToolPort ] }>();

function editPort(port: ToolPort) {
  emit('editPort', port)
}

const keys: Record<string, [number, number]> = { Right: [20, 0], Left: [-20, 0], Down: [0, 20], Up: [0, -20] }
Object.keys(keys).forEach((k: string) => {
  useKeyboardEvents().keydown(`Arrow${k}`, () => {
    if (selection.value.item === undefined) return;
    const item: InnerNode | undefined = find(tool.nodes, { id: selection.value.item.id });
    if (item === undefined) return;
    item.x += keys[k][0]; item.y += keys[k][1];
    debounce(item.id, 500, () => repositories.tool.nodes.update(tool, tool.nodes, item));
  });
});
</script>