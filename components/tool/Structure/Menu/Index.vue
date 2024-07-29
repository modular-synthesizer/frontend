<template>
  <v-app-bar density="compact">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" variant="text">Fichier</v-btn>
      </template>
      <v-list>
        <v-list-item @click="save">Sauvegarder</v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { api } from '~~/lib/api/Api';
import ITool from '~~/lib/interfaces/ITool';


const props = defineProps({
  tool: { type: Object as PropType<ITool>, required: true },
});

async function save() {
  await api.auth_put(`/tools/${useRoute().params.id}`, props.tool)
}
</script>