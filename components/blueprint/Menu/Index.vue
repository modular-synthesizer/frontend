<template>
  <v-app-bar density="compact">
    <v-btn to="/blueprints" icon>
      <v-icon>mdi-chevron-left</v-icon>
      <v-tooltip activator="parent" location="bottom">Retour à la liste</v-tooltip>
    </v-btn>
    <v-btn icon @click="emit('save', blueprint)" v-if="mode === 'infos'">
      <v-icon>mdi-content-save-outline</v-icon>
      <v-tooltip activator="parent" location="bottom">Sauvegarder</v-tooltip>
    </v-btn>
    <v-menu v-if="!creationMode && mode === 'structure'" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="bottom">Ajouter</v-tooltip>
        </v-btn>
      </template>
      <v-list v-model:opened="open" density="compact" nav :lines="false">
        <blueprint-structure-create-node @created="createNode" />
        <blueprint-structure-create-link @created="createLink" :blueprint="blueprint" />
        <blueprint-structure-create-port @created="createPort" :blueprint="blueprint" />
        <blueprint-structure-create-parameter @created="createParameter" :blueprint="blueprint" />
      </v-list>
    </v-menu>
    <v-btn v-if="mode === 'appearance'" @click="useControlEdition().startEdit({ id: '', payload: { x: 0, y: 0 }, editing: true, component: 'Knob'})" icon>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <template v-if="!creationMode">
      {{ mode }}
      <v-btn @click="emit('modeChanged', 'infos')">Infos</v-btn>
      <v-btn @click="emit('modeChanged', 'structure')">Structure</v-btn>
      <v-btn @click="emit('modeChanged', 'appearance')">Appearance</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import type { Blueprint } from '~~/types/blueprints/Blueprint';
import type { InnerLink } from '~~/types/blueprints/InnerLink';
import type { InnerNode } from '~~/types/blueprints/InnerNode';
import type { ToolParameter } from '~~/types/blueprints/Parameter';
import type { ToolPort } from '~~/types/blueprints/Port';
import { repositories } from '~~/lib/repositories';
import type { ToolTabs } from '~/types/blueprints/ToolTabs';

const { blueprint, mode, creationMode } = defineProps({
  blueprint: { type: Object as PropType<Blueprint>, required: true },
  creationMode: { type: Boolean, default: false },
  mode: { type: String as PropType<ToolTabs>, default: 'infos' }
});

const emit = defineEmits<{ modeChanged: [ ToolTabs ], save: [ Blueprint ] }>();

const open = ref([]);

async function createPort(port: ToolPort) {
  blueprint.ports.push(await repositories.blueprint.ports.create(blueprint, port));
  emit('save', blueprint)
}
async function createParameter(parameter: ToolParameter) {
  blueprint.parameters.push(await repositories.blueprint.parameters.create(blueprint, parameter));
  emit('save', blueprint)
}
async function createNode(node: InnerNode) {
  blueprint.nodes.push(await repositories.blueprint.nodes.create(blueprint, node));
  emit('save', blueprint)
}
async function createLink(link: InnerLink) {
  blueprint.links.push(await repositories.blueprint.links.create(blueprint, link));
  emit('save', blueprint)
}
</script>