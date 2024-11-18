<template>
  <tools-creator :tool="tool" />
</template>

<script setup lang="ts">
import ToolsFactory from '~~/lib/factories/ToolsFactory';
import ITool from '~~/lib/interfaces/ITool';

const tool: Ref<ITool> = ref(ToolsFactory.empty());

definePageMeta({ layout: 'empty' });
  
// async function save() {
//   await repositories.tools.create(tool.value);
//   useRouter().push('/tools');
// }

onMounted(() => {
  const content = localStorage.getItem("import-json");
  if (content !== null) {
      tool.value = JSON.parse(JSON.parse(content));
  }
})
</script>