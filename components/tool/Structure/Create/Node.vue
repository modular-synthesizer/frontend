<template>
  <v-btn :key icon>
    <v-icon>mdi-dock-window</v-icon>
    <v-dialog max-width="500" activator="parent">
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
  </v-btn>
</template>

<script setup lang="ts">
import { clone, sortBy } from 'lodash';
import type { Generator } from '~/types/Generator';
import type { InnerNode } from '~~/types/tools/InnerNode';
import { repositories } from '~~/lib/repositories';

const { key } = defineProps<{ key: number }>()

const emit = defineEmits<{ created: [ node: InnerNode]}>();

const generators: Generator[] = sortBy(await repositories.generators.list(useSession().token), "name");
const node: Ref<InnerNode> = ref(createEmptyNode());
function createEmptyNode(): InnerNode {
  return {
    name: '',
    generator: generators[0].name,
    x: 0,
    y: 0,
    id: '',
    width: 0,
    height: 0
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