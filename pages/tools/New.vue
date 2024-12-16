<template>
  <tool-creator v-model="tool" :creation-mode="true" />
</template>

<script setup lang="ts">
import ToolsFactory from '~~/lib/factories/ToolsFactory';
import type { Tool } from '~~/types/tools/Tool';

const tool: Ref<Tool> = ref(ToolsFactory.empty());

  // @ts-ignore
definePageMeta({ layout: 'empty' });

onMounted(() => {
  const content = localStorage.getItem("import-json");
  if (content !== null) {
      tool.value = JSON.parse(JSON.parse(content));
  }
})
</script>