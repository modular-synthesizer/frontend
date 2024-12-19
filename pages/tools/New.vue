<template>
  <tool-creator v-model="tool" :creation-mode="true" />
</template>

<script setup lang="ts">
import { createEmptyTool } from '~/utils/factories/tools';
import type { Tool } from '~~/types/tools/Tool';

const tool: Ref<Tool> = ref(createEmptyTool());

  // @ts-ignore
definePageMeta({ layout: false });

onMounted(() => {
  const content = localStorage.getItem("import-json");
  if (content !== null) {
      tool.value = JSON.parse(JSON.parse(content));
  }
})
</script>