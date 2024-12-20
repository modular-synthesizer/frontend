<template>
  <template v-for="link in tool.links">
    <tool-structure-link
      v-if="link.id !== selection.item?.id"
      :link="link"
      :tool="tool"
      @selected="selection.select(link)"
    />
  </template>
  <tool-structure-link
    v-if="selection.item"
    :link="selection.item"
    :tool="tool"
    :selected="true"
    @deselected="selection.reset()"
  />
</template>

<script lang="ts" setup>
import type { Tool } from '~~/types/tools/Tool';

const { tool } = defineProps({
  tool: { type: Object as PropType<Tool>, required: true }
});

const selection = ref(useSelectables().state.value.links);
</script>