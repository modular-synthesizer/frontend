<template>
  <template v-for="link in tool.links">
    <tool-structure-link
      v-if="link.id !== selected.item?.id"
      :link="link"
      :tool="tool"
      @selected="selectItem(link, 'links', tool)"
    />
  </template>
  <tool-structure-link
    v-if="selected.item !== null && selected.uri === 'links'"
    :link="selected.item"
    :tool="tool"
    :selected="true"
    @deselected="selectItem(null, 'links', tool)"
  />
</template>

<script lang="ts" setup>
import ITool from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
});
</script>