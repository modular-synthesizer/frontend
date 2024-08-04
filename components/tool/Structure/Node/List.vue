<template>
  <template v-for="node in tool.nodes">
    <tool-structure-node
      v-if="node.id !== selected?.id"
      :node="node"
      :selected="false"
      @select="selectNode(node)"
      @removed="deleteNode(node)"
      :tool="tool"
    />
  </template>
  <tool-structure-node
    v-if="selected !== null"
    :node="selected"
    :selected="true"
    @removed="deleteNode(selected)"
    :tool="tool"
  />
</template>

<script lang="ts" setup>
import { remove } from 'lodash';
import { registerBackgroundClick, triggerBackgroundCallbacks } from '~~/composables/tools/structure';
import { api } from '~~/lib/api/Api';
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
})

const selected: Ref<InnerNode|null> = ref(null);
const timer: Ref<number> = ref(-1);

function selectNode(node: InnerNode|null) {
  triggerBackgroundCallbacks();
  selected.value = node;
}
  
async function deleteNode(node: InnerNode|null) {
  if (node === null) return;
  if (node.id === selected.value?.id) selected.value = null;
  remove(tool.nodes, node);
  await api.auth_delete(`/tools/nodes/${node.id}`, { tool_id: tool.id });
}

function handleKeyPress (event: KeyboardEvent) {
  if (selected.value === null) return;
  window.clearTimeout(timer.value);
  switch(event.code) {
    case 'ArrowRight':
      selected.value.x += 20; break;
    case 'ArrowLeft':
      selected.value.x -= 20; break;
    case 'ArrowDown':
      selected.value.y += 20; break;
    case 'ArrowUp':
      selected.value.y -= 20; break;
    case 'Delete':
      deleteNode(selected.value); return;
  }
  const id = selected.value.id;
  timer.value = window.setTimeout(async () => {
    await api.auth_put(`/tools/nodes/${id}`, { ...selected.value, tool_id: useRoute().params.id });
  }, 200);
}
window.addEventListener('keydown', handleKeyPress);

onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyPress));

registerBackgroundClick(() => {
  selected.value = null
})
</script>