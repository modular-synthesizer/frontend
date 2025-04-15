<template>
  <div class="global-wrapper">
    <v-tabs v-model="mode" align-tabs="center">
      <v-tab :value="'infos'">Informations</v-tab>
      <v-tab :value="'structure'">Structure</v-tab>
      <v-tab :value="'appearance'">Apparence</v-tab>
      <v-tab>{{ mode }}</v-tab>
    </v-tabs>
    <v-tabs-window v-model="mode">
      <v-tabs-window-item value="infos">
        <v-form v-model="valid" ref="form" @submit.prevent.stop>
          <tool-informations v-model="tool" />
        </v-form>
      </v-tabs-window-item>
      <v-tabs-window-item value="structure">
        <div class="content-wrapper"><tool-structure :tool="tool" /></div>
      </v-tabs-window-item>
      <v-tabs-window-item value="appearance">
        <div class="content-wrapper"><tool-appearance :tool="tool" :creation-mode="!tool.id" /></div>
      </v-tabs-window-item>
    </v-tabs-window>

    <v-fab app size="large" color="primary" icon="$menu" location="right bottom">
      <v-icon>$menu</v-icon>
      <v-speed-dial location="top center" transition="slide-y-reverse-transition" v-model="dial" activator="parent">
        <v-tooltip text="Save">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn key="1" color="success" icon v-bind="tooltipProps" @click="onSaveRequest">
              <v-icon>mdi-content-save-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <template v-if="mode === 'structure'">
          <tool-structure-create-node @created="createNode" key="2" />
          <tool-structure-create-link @created="createLink" :tool="tool" key="3" />
          <tool-structure-create-port @created="createPort" :tool="tool" key="4" />
          <tool-structure-create-parameter @created="createParameter" :tool="tool" key="5" />
        </template>
      </v-speed-dial>
    </v-fab>
  </div>
</template>

<script setup lang="ts">
import type { Tool } from '~~/types/tools/Tool';
import { repositories } from '~~/lib/repositories';
import type { InnerLink } from '~/types/tools/InnerLink';
import type { InnerNode } from '~/types/tools/InnerNode';
import type { ToolParameter } from '~/types/tools/Parameter';
import type { ToolPort } from '~/types/tools/Port';

const props = defineProps({
  modelValue: { type: Object as PropType<Tool>, required: true },
});

const tool = ref(props.modelValue);
const mode = ref(null)
const dial = ref(false)
const valid: Ref<boolean|null> = ref(null);
const form = ref<HTMLFormElement|null>(null);

async function onSaveRequest(t: Tool) {
  tool.value = t;
  await form.value?.validate();
  if (valid.value) save();
}

async function createPort(port: ToolPort) {
  tool.value.ports.push(await repositories.tool.ports.create(tool.value, port));
}
async function createParameter(parameter: ToolParameter) {
  tool.value.parameters.push(await repositories.tool.parameters.create(tool.value, parameter));
}
async function createNode(node: InnerNode) {
  tool.value.nodes.push(await repositories.tool.nodes.create(tool.value, node));
}
async function createLink(link: InnerLink) {
  tool.value.links.push(await repositories.tool.links.create(tool.value, link));
}

async function save() {
  if (!props.modelValue.id) {
    const creation: Tool = await repositories.tools.create(props.modelValue);
    props.modelValue.id = creation.id;
  }
  else repositories.tools.update(props.modelValue);
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