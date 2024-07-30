<template>
  <v-app-bar density="compact">
    <v-btn icon @click="save"><v-icon>mdi-content-save</v-icon></v-btn>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" text><v-icon>mdi-plus</v-icon>&nbsp;&nbsp;nouveau</v-btn>
      </template>
      <v-list v-model:opened="open" density="compact" nav :lines="false">
        <tool-structure-create-node @created="addNode" />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { api } from '~~/lib/api/Api';
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';

const props = defineProps({
  tool: { type: Object as PropType<ITool>, required: true },
});

const open = ref([])

async function addNode(node: InnerNode) {
  const n: InnerNode = await api.auth_post('/tools/nodes', { ...node, tool_id: props.tool.id });
  props.tool.nodes.push(n);
}

async function save() {
  await api.auth_put(`/tools/${useRoute().params.id}`, props.tool)
}
</script>