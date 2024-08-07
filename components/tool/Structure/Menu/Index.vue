<template>
  <v-app-bar density="compact">
    <v-btn to="/tools" icon>
      <v-icon>mdi-chevron-left</v-icon>
      <v-tooltip activator="parent" location="bottom">Retour à la liste</v-tooltip>
    </v-btn>
    <v-btn icon @click="save">
      <v-icon>mdi-content-save-outline</v-icon>
      <v-tooltip activator="parent" location="bottom">Sauvegarder</v-tooltip>
    </v-btn>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="bottom">Ajouter</v-tooltip>
        </v-btn>
      </template>
      <v-list v-model:opened="open" density="compact" nav :lines="false">
        <tool-structure-create-node @created="addNode" />
        <tool-structure-create-link @created="addLink" :tool="tool" />
        <tool-structure-create-port @created="addPort" :tool="tool" />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { api } from '~~/lib/api/Api';
import ITool, { InnerLink, InnerNode, IToolPort } from '~~/lib/interfaces/ITool';

const props = defineProps({
  tool: { type: Object as PropType<ITool>, required: true },
});

const open = ref([])

async function addNode(node: InnerNode) {
  props.tool.nodes.push(await api.auth_post('/tools/nodes', { ...node, tool_id: props.tool.id }));
}

async function addLink(link: InnerLink) {
  props.tool.links.push(await api.auth_post('/tools/links', { tool_id: props.tool.id, ...link }));
}

async function addPort(port: IToolPort) {
  props.tool.ports.push(await api.auth_post('/tools/ports', { tool_id: props.tool.id, ...port }));
}

async function save() {
  await api.auth_put(`/tools/${useRoute().params.id}`, props.tool)
}
</script>