<template>
  <tool-creator v-model="tool" :creation-mode="true" />
</template>

<script setup lang="ts">
import ToolsFactory from '~~/lib/factories/ToolsFactory';
import ITool from '~~/lib/interfaces/ITool';

const tool: Ref<ITool> = ref(ToolsFactory.empty());

definePageMeta({ layout: 'empty' });

onMounted(() => {
  const content = localStorage.getItem("import-json");
  if (content !== null) {
      tool.value = JSON.parse(JSON.parse(content));
  }
})
</script>