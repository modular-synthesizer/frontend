<template>
  <template v-for="node in tool.nodes">
    <tool-structure-node
      v-if="node.id !== selected.item?.id"
      :node="node"
      :selected="false"
      @select="selectItem(node, 'nodes', tool)"
      :tool="tool"
      @edit-port="editPort"
    />
  </template>
  <tool-structure-node
    v-if="selected.item !== null && selected.uri === 'nodes'"
    :node="selected.item"
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
})

const emit = defineEmits<{ editPort: [ item: ToolPort ] }>();

const timer: Ref<number> = ref(-1);

function editPort(port: ToolPort) {
  emit('editPort', port)
}

function handleKeyPress (event: KeyboardEvent) {
  if (selected.value.item === null) return;
  if (!isNodeSelected(selected.value.item)) return;
  window.clearTimeout(timer.value);
  switch(event.code) {
    case 'ArrowRight':
      selected.value.item.x += 20; break;
    case 'ArrowLeft':
      selected.value.item.x -= 20; break;
    case 'ArrowDown':
      selected.value.item.y += 20; break;
    case 'ArrowUp':
      selected.value.item.y -= 20; break;
  }
  const id = selected.value.item.id;
  const item: InnerNode = find(tool.nodes, { id }) as InnerNode;
  item.x = selected.value.item.x;
  item.y = selected.value.item.y;
  timer.value = window.setTimeout(async () => {
    const item: Selectable = selected.value.item as unknown as InnerNode;
    await repositories.tool.nodes.update(tool, tool.nodes, item);
  }, 500);
}
window.addEventListener('keydown', handleKeyPress);

onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyPress));
</script>