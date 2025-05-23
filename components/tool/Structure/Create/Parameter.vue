<template>
  <v-btn :key icon>
    <v-icon>mdi-knob</v-icon>
    <v-dialog max-width="800" activator="parent">
      <template v-slot:default="{ isActive }">
        <v-form @submit.prevent.stop="create(isActive)" v-model="form">
          <v-card title="Créer un paramètre">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-text-field v-model="param.name" label="Nom" variant="outlined" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="param.field" label="Champ ciblé" variant="outlined" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete v-model="param.targets" label="Noeuds ciblés" variant="outlined" :items="getTargets()" multiple chips closable-chips />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3">
                    <v-text-field v-model="param.minimum" label="Minimum" variant="outlined" type="number" :max="param.maximum" @change="changeMin" />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field v-model="param.maximum" label="Maximum" variant="outlined" type="number" :min="param.minimum" @change="changeMax" />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field v-model="param.default" label="Default" variant="outlined" type="number" :max="param.maximum" :min="param.minimum" />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field v-model="param.step" label="Crantage" variant="outlined" type="number" />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field v-model="param.precision" label="Précision" variant="outlined" type="number" />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn color="red" @click="cancel(isActive);">Annuler</v-btn>
              <v-btn color="green" type="submit">Valider</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </template>
    </v-dialog>
  </v-btn>
</template>

<script lang="ts" setup>
import type { Tool } from '~~/types/tools/Tool';
import type { InnerNode } from '~~/types/tools/InnerNode';
import type { ToolParameter } from '~~/types/tools/Parameter';

const form: Ref = ref();

const props = defineProps({
  tool: { type: Object as PropType<Tool>, required: true },
    key: { type: Number }
})

function createEmptyParameter(): ToolParameter {
  return {
    targets: [], name: '', field: '', default: 50, step: 1, precision: 0, minimum: 0, maximum: 100, id: ''
  }
}

const emit = defineEmits<{ created: [ link: ToolParameter]}>();

const param: Ref<ToolParameter> = ref(createEmptyParameter());

function cancel(activeFlag: { value: boolean }) {
  activeFlag.value = false;
  param.value = createEmptyParameter();
}

function getTargets() {
  return props.tool.nodes.map((n: InnerNode) => n.name)
}

function changeMin() {
  if (param.value.minimum > param.value.default) {
    param.value.default = param.value.minimum
  }
}

function changeMax() {
  if (param.value.maximum < param.value.default) {
    param.value.default = param.value.maximum
  }
}

async function create(activeFlag: { value: boolean }) {
  if (!form.value) return;
  emit('created', param.value);
  cancel(activeFlag);
}
</script>