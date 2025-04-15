<template>
  <v-dialog max-width="800">
    <template v-slot:activator="{ props: dialogProps }">
      <v-btn v-bind="dialogProps" :key icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-form @submit.prevent.stop="create(isActive)" v-model="form">
        <v-card title="Créer un lien">
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col cols="9">
                  <v-select variant="outlined" :items="getItems()" label="Noeud de départ" v-model="link.from.node" />
                </v-col>
                <v-col cols="3">
                  <v-text-field variant="outlined" label="Index" v-model="link.from.index" type="number" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="9">
                  <v-text-field variant="outlined" label="Noeud ou paramètre de fin" v-model="link.to.node" :rules="[validEndNode]" />
                </v-col>
                <v-col cols="3">
                  <v-text-field variant="outlined" label="Index" v-model="link.to.index" type="number" />
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

<script lang="ts" setup>
import type { Tool } from '~~/types/tools/Tool';
import type { InnerLink } from '~~/types/tools/InnerLink';
import type { InnerNode } from '~~/types/tools/InnerNode';

const form: Ref = ref();

const props = defineProps({
  tool: { type: Object as PropType<Tool>, required: true },
  key: { type: Number },
})

function createEmptyLink(): InnerLink {
  return {
    id: '',
    from: { node: getItems()[0], index: 0 },
    to: { node: '', index: 0 },
  }
}

const emit = defineEmits<{ created: [ link: InnerLink]}>();

const link: Ref<InnerLink> = ref(createEmptyLink());

function getItems() {
  return props.tool.nodes.filter((n: InnerNode) => n.inputs > 0).map((n: InnerNode) => n.name)
}

function nodeExists(tool: Tool, name: string) {
  return tool.nodes.findIndex((n: InnerNode) => n.name === name) > -1
}

function validEndNode(value: string) {
  const message: string = "Node with name " + value + " does not exist"
  if (value.includes('.')) {
    return nodeExists(props.tool, value.split('.')[0]) || message;
  }
  else {
    return nodeExists(props.tool, value) || message;
  }
}

function cancel(activeFlag: { value: boolean }) {
  activeFlag.value = false;
  link.value = createEmptyLink();
}

async function create(activeFlag: { value: boolean }) {
  if (!form.value) return;
  emit('created', link.value);
  cancel(activeFlag);
}
</script>