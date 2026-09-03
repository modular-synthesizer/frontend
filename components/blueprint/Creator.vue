<template>
  <div class="global-wrapper">
    <v-tabs v-model="mode" align-tabs="center">
      <v-tab :value="'infos'">Informations</v-tab>
      <v-tab :value="'structure'">Structure</v-tab>
      <v-tab :value="'appearance'">Apparence</v-tab>
    </v-tabs>
    <v-tabs-window v-model="mode">
      <v-tabs-window-item value="infos">
        <v-form v-model="valid" ref="form" @submit.prevent.stop>
          <blueprint-informations v-model="blueprint" />
        </v-form>
      </v-tabs-window-item>
      <v-tabs-window-item value="structure">
        <div class="content-wrapper"><blueprint-structure :blueprint="blueprint" @moved="moved" @panned="c => applyPanning(c)" /></div>
      </v-tabs-window-item>
      <v-tabs-window-item value="appearance">
        <div class="content-wrapper"><blueprint-appearance :blueprint="blueprint" :creation-mode="!blueprint.id" /></div>
      </v-tabs-window-item>
    </v-tabs-window>
    

    <v-fab app size="large" color="primary" icon="$menu" location="right bottom">
      <v-icon>$menu</v-icon>
      <v-speed-dial location="top center" transition="slide-y-reverse-transition" v-model="dial" activator="parent">
        <v-tooltip text="Save">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn key="1" color="success" icon v-bind="tooltipProps" @click="onSaveRequest(blueprint)">
              <v-icon>mdi-content-save-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <template v-if="mode === 'structure'">
          <blueprint-structure-create-node @created="createNode" key="2" />
          <blueprint-structure-create-link @created="createLink" :blueprint="blueprint" key="3" />
          <blueprint-structure-create-port @created="createPort" :blueprint="blueprint" key="4" />
          <blueprint-structure-create-parameter @created="createParameter" :blueprint="blueprint" key="5" />
        </template>
      </v-speed-dial>
    </v-fab>
  </div>
</template>

<script setup lang="ts">
import type { Blueprint } from '~~/types/blueprints/Blueprint';
import { repositories } from '~~/lib/repositories';
import type { InnerLink } from '~/types/blueprints/InnerLink';
import type { InnerNode } from '~/types/blueprints/InnerNode';
import type { ToolParameter } from '~/types/blueprints/Parameter';
import type { ToolPort } from '~/types/blueprints/Port';

const props = defineProps({
  modelValue: { type: Object as PropType<Blueprint>, required: true },
});

const blueprint = ref(props.modelValue);
const mode = ref(null)
const dial = ref(false)
const valid: Ref<boolean|null> = ref(null);
const form = ref<HTMLFormElement|null>(null);

async function onSaveRequest(t: Blueprint) {
  blueprint.value = t;
  await form.value?.validate();
  if (valid.value) save();
}

async function createPort(port: ToolPort) {
  blueprint.value.ports.push(await repositories.blueprint.ports.create(blueprint.value, port));
}
async function createParameter(parameter: ToolParameter) {
  blueprint.value.parameters.push(await repositories.blueprint.parameters.create(blueprint.value, parameter));
}
async function createNode(node: InnerNode) {
  blueprint.value.nodes.push(await repositories.blueprint.nodes.create(blueprint.value, node));
}
async function createLink(link: InnerLink) {
  blueprint.value.links.push(await repositories.blueprint.links.create(blueprint.value, link));
}

async function save() {
  if (!blueprint.value.id) {
    const creation: Blueprint = await repositories.blueprints.create(blueprint.value);
    blueprint.value.id = creation.id;
  }
  else repositories.blueprints.update(blueprint.value);
}

async function moved(coords: PlacedBox) {
  await repositories.blueprints.updateNode(blueprint.value, coords)
}

async function applyPanning(c: Coordinates) {
  blueprint.value.x = c.x;
  blueprint.value.y = c.y;
  onSaveRequest(blueprint.value);
}
</script>

<style scoped>
.global-wrapper {
  height: 100vh;
  overflow: hidden;
  width: 100%;
}

.content-wrapper {
  height: calc(100vh - 48px);
  width: 100%;
  overflow-y: auto;
}
</style>