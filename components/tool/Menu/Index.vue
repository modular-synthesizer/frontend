<template>
  <v-app-bar density="compact">
    <v-btn to="/tools" icon>
      <v-icon>mdi-chevron-left</v-icon>
      <v-tooltip activator="parent" location="bottom">Retour à la liste</v-tooltip>
    </v-btn>
    <v-btn icon @click="emit('save', tool)">
      <v-icon>mdi-content-save-outline</v-icon>
      <v-tooltip activator="parent" location="bottom">Sauvegarder</v-tooltip>
    </v-btn>
    <v-menu v-if="!creationMode" :close-on-content-click="false">
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
    <v-spacer></v-spacer>
    <template v-if="!creationMode">
      <v-btn @click="emit('modeChanged', 'infos')">Infos</v-btn>
      <v-btn @click="emit('modeChanged', 'structure')">Structure</v-btn>
      <v-btn @click="emit('modeChanged', 'appearance')">Appearance</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import ITool, { InnerLink, InnerNode, IToolParameter, IToolPort } from '~~/lib/interfaces/ITool';
import { repositories } from '~~/lib/repositories';
import { ToolTabs } from '~~/lib/types/ToolTabs';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true },
  creationMode: { type: Boolean, default: false }
});

const emit = defineEmits<{ modeChanged: [ ToolTabs ], save: [ ITool ] }>();

const open = ref([]);

async function createPort(port: IToolPort) {
  tool.ports.push(await repositories.tool.ports.create(tool, port));
  emit('save', tool)
}
async function createParameter(parameter: IToolParameter) {
  tool.parameters.push(await repositories.tool.parameters.create(tool, parameter));
  emit('save', tool)
}
async function createNode(node: InnerNode) {
  tool.nodes.push(await repositories.tool.nodes.create(tool, node));
  emit('save', tool)
}
async function createLink(link: InnerLink) {
  tool.links.push(await repositories.tool.links.create(tool, link));
  emit('save', tool)
}
</script>