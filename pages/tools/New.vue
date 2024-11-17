<template>
  <tools-creator v-model="tool" @update:model-value="save" :creation-mode="true" />
</template>

<script setup lang="ts">
import ToolsFactory from '~~/lib/factories/ToolsFactory';
import ITool from '~~/lib/interfaces/ITool';
import { repositories } from '~~/lib/repositories';

const tool: Ref<ITool> = ref(ToolsFactory.empty());
  
async function save() {
  await repositories.tools.create(tool.value);
  useRouter().push('/tools');
}

onMounted(() => {
  const content = localStorage.getItem("import-json");
  if (content !== null) {
      tool.value = JSON.parse(JSON.parse(content));
  }
})
</script>