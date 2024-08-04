<template>
  <template v-for="link in tool.links">
    <tool-structure-link
      v-if="link.id !== selected?.id"
      :link="link"
      :tool="tool"
      @selected="selectLink(link)"
    />
  </template>
  <tool-structure-link
    v-if="selected !== null"
    :link="selected"
    :tool="tool"
    :selected="true"
    @deselected="selectLink(null)"
  />
</template>

<script lang="ts" setup>
import { remove } from 'lodash';
import { registerBackgroundClick, triggerBackgroundCallbacks } from '~~/composables/tools/structure';
import { api } from '~~/lib/api/Api';
import ITool, { InnerLink } from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
})

const selected: Ref<InnerLink|null> = ref(null);

function selectLink(link: InnerLink|null) {
  triggerBackgroundCallbacks();
  selected.value = link;
}
  
async function deleteLink(link: InnerLink|null) {
  if (link === null) return;
  if (link.id === selected.value?.id) selected.value = null;
  remove(tool.links, link);
  await api.auth_delete(`/tools/links/${link.id}`, { tool_id: tool.id });
}

function handleKeyPress (event: KeyboardEvent) {
  if (selected.value === null) return;
  if (event.code === 'Delete') deleteLink(selected.value);
}
window.addEventListener('keydown', handleKeyPress);

onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyPress));

registerBackgroundClick(() => {
  selected.value = null
})
</script>