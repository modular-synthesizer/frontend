<template>
  <blueprint-creator v-model="blueprint" :creation-mode="true" />
</template>

<script setup lang="ts">
import type { Blueprint } from '~~/types/blueprints/Blueprint';

const blueprint: Ref<Blueprint> = ref({
  id: "",
  name: "",
  slots: 2,
  experimental: true,
  nodes: [],
  links: [],
  parameters: [],
  ports: [],
  controls: [],
  x: 0, y: 0, scale: 1.0,
  category: { id: "", name: "" }
});

  // @ts-ignore
definePageMeta({ layout: false });

onMounted(() => {
  const content = localStorage.getItem("import-json");
  if (content !== null) {
      blueprint.value = JSON.parse(JSON.parse(content));
  }
})
</script>