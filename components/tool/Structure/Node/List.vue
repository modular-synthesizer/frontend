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
import ITool, { IToolPort } from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
})

const emit = defineEmits<{ editPort: [ item: IToolPort ] }>();

const timer: Ref<number> = ref(-1);

function editPort(port: IToolPort) {
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
  timer.value = window.setTimeout(async () => {
    await api_put(`/tools/nodes/${id}`, { ...selected.value.item, tool_id: tool.id });
  }, 200);
}
window.addEventListener('keydown', handleKeyPress);

onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyPress));
</script>