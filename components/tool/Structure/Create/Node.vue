<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: dialogProps }">
      <v-list-item v-bind="dialogProps">Noeud</v-list-item>
    </template>
    <template v-slot:default="{ isActive }">
      <v-form @submit.prevent.stop="save(isActive)">
        <v-card title="Créer un noeud">
          <v-card-text>
            <v-text-field v-model="node.name" label="Nom du noeud" variant="outlined" class="mb-4" />
            <v-select
              :items="generators"
              item-title="name"
              item-value="name"
              v-model="node.generator"
              label="générateur"
              variant="outlined"
            />
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
import { clone, sortBy } from 'lodash';
import { IGenerator } from '~~/lib/interfaces/IGenerator';
import { InnerNode } from '~~/lib/interfaces/ITool';
import { repositories } from '~~/lib/repositories';

const emit = defineEmits<{ created: [ node: InnerNode]}>();

const generators: IGenerator[] = sortBy(await repositories.generators.list(), "name");
const node: Ref<InnerNode> = ref(createEmptyNode());
function createEmptyNode(): InnerNode {
  return {
    name: '',
    generator: generators[0].name,
    x: 0,
    y: 0,
    inputs: 1,
    outputs: 1,
    id: ''
  };
}

function cancel(activeFlag: { value: boolean}) {
  node.value = createEmptyNode();
  activeFlag.value = false;
}

function save(activeFlag: { value: boolean }) {
  emit('created', clone(node.value));
  cancel(activeFlag);
}
</script>