<template>
  <v-dialog max-width="600" activator="parent">
    <v-form @submit.prevent.stop="validate" v-model="form">
      <v-card title="Créer un port d'entrée/sortie">
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="8">
                <v-text-field label="Name" variant="outlined" v-model="port.name" />
              </v-col>
              <v-col cols="4">
                <v-text-field label="Index" type="number" variant="outlined" v-model="port.index" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <v-select label="Target" variant="outlined" :items="getItems()" v-model="port.target"></v-select>
              </v-col>
              <v-col cols="4">
                <v-select label="Direction" variant="outlined" :items="['input', 'output']" v-model="port.kind"></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <template v-slot:actions>
          <v-btn color="red" @click="emit('cancelled')">Annuler</v-btn>
          <v-btn color="green" @click="validate">Valider</v-btn>
        </template>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Tool } from '~~/types/tools/Tool';
import type { InnerNode } from '~~/types/tools/InnerNode';
import type { ToolPort } from '~~/types/tools/Port';

const form: Ref = ref();

const props = defineProps({
  port: { type: Object as PropType<ToolPort>, required: true },
  tool: { type: Object as PropType<Tool>, required: true }
});

const emit = defineEmits<{ cancelled: [], validated: [ToolPort] }>();

function getItems() {
  if (props.port.target === '') props.port.target = props.tool.nodes[0].name
  return props.tool.nodes.map((n: InnerNode) => n.name)
}

function validate() {
  if (!form.value) return;
  emit('validated', props.port);
}
</script>