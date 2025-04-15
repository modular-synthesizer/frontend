<template>
  <tool-menu :tool="tool" @mode-changed="changeMode" @save="onSaveRequest" :creation-mode="!tool.id" :mode="mode" />
  <div class="global-wrapper" v-if="modelValue">
    <v-form v-model="valid" ref="form" v-if="mode === 'infos'" @submit.prevent.stop>
      <tool-informations v-model="tool" :rules="rules" />
    </v-form>
    <tool-structure v-else-if="mode === 'structure'" :tool="tool" />
    <tool-appearance v-else :tool="tool" :creation-mode="!tool.id" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Tool } from '~~/types/tools/Tool';
import { repositories } from '~~/lib/repositories';
import { required } from '~~/lib/rules';
import type { ToolTabs } from '~/types/tools/ToolTabs';

const props = defineProps({
  modelValue: { type: Object as PropType<Tool>, required: true },
});

const tool = ref(props.modelValue);
const mode: Ref<ToolTabs> = ref(tool.value.id === '' ? 'infos': 'appearance');
const valid: Ref<boolean|null> = ref(null);
const form = ref<HTMLFormElement|null>(null);

const rules: {[key: string]: Function[]} = {
  name: [ required('pouet', useI18n()) ]
}

function changeMode(m: ToolTabs) {
  console.log(mode);
  mode.value = m;
}

async function onSaveRequest(t: Tool) {
  tool.value = t;
  await form.value?.validate();
  if (valid.value) save();
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
  padding-top: 48px;
  width: 100%;
}
</style>