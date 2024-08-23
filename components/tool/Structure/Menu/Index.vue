<template>
  <v-app-bar density="compact">
    <v-btn to="/tools" icon>
      <v-icon>mdi-chevron-left</v-icon>
      <v-tooltip activator="parent" location="bottom">Retour à la liste</v-tooltip>
    </v-btn>
    <v-btn icon @click="updateTool(tool)">
      <v-icon>mdi-content-save-outline</v-icon>
      <v-tooltip activator="parent" location="bottom">Sauvegarder</v-tooltip>
    </v-btn>
    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="bottom">Ajouter</v-tooltip>
        </v-btn>
      </template>
      <v-list v-model:opened="open" density="compact" nav :lines="false">
        <tool-structure-create-node @created="createNode" />
        <tool-structure-create-link @created="createLink" :tool="tool" />
        <tool-structure-create-port @created="createPort" :tool="tool" />
        <tool-structure-create-parameter @created="createParameter" :tool="tool" />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { createElement } from '~~/composables/tools/api';
import ITool from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true },
});

const open = ref([]);

const createPort = createElement('ports', tool);
const createParameter = createElement('parameters', tool);
const createLink = createElement('links', tool);
const createNode = createElement('nodes', tool);
</script>