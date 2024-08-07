<template>
  <v-dialog max-width="600">
    <template v-slot:activator="{ props: dialogProps }">
      <v-list-item v-bind="dialogProps">Port</v-list-item>
    </template>
    <template v-slot:default="{ isActive }">
      <v-form @submit.prevent.stop="create(isActive)" v-model="form">
        <v-card title="Créer un port d'entrée/sortie" v-if="$props.tool">
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
          <v-card-actions>
            <v-btn color="red" @click="cancel(isActive);">Annuler</v-btn>
            <v-btn color="green" type="submit">Valider</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import ITool, { InnerNode, IToolPort } from '~~/lib/interfaces/ITool';

const form: Ref = ref();

const port: Ref<IToolPort> = ref(createEmptyPort());

const props = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
})

const emit = defineEmits<{ created: [ port: IToolPort]}>();

function createEmptyPort(): IToolPort {
  return {
    id: '',
    kind: 'input',
    target: '',
    index: 0,
    name: ''
  }
}

function getItems() {
  if (port.value.target === '') port.value.target = props.tool.nodes[0].name
  return props.tool.nodes.map((n: InnerNode) => n.name)
}

function cancel(activeFlag: { value: boolean }) {
  activeFlag.value = false;
  port.value = createEmptyPort();
}

async function create(activeFlag: { value: boolean }) {
  if (!form.value) return;
  emit('created', port.value);
  cancel(activeFlag);
}
</script>
