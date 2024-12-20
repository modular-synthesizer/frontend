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

function handleKeyPress (event: KeyboardEvent) {
  if (selection.value.item === undefined) return;
  const item: InnerNode | undefined = find(tool.nodes, { id: selection.value.item.id });
  if (item === undefined) return;
  switch(event.code) {
    case 'ArrowRight':
      item.x += 20; break;
    case 'ArrowLeft':
      item.x -= 20; break;
    case 'ArrowDown':
      item.y += 20; break;
    case 'ArrowUp':
      item.y -= 20; break;
  }
  debounce(`edit-${item.id}`, 500, async () => {
    await repositories.tool.nodes.update(tool, tool.nodes, item);
  });
}
window.addEventListener('keydown', handleKeyPress);

onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyPress));
</script>