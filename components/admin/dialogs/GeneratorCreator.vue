<template>
  <v-dialog v-model="creationDialog">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">{{ $t('common.add') }}</v-btn>
    </template>
    <v-form @submit.prevent="create" v-model="validForm" ref="form">
      <v-card class="mx-auto" width="50%">
        <template v-slot:title>Créer un générateur</template>
        <v-card-text>
          <v-text-field
            variant="outlined"
            density="compact"
            label="Nom du générateur"
            hint="Ce nom sera utilisé en tant que clef de traduction"
            v-model="generator.name"
          />
          <v-textarea
            v-model="generator.code"
            rows="15"
            no-resize
            variant="outlined"
            label="Code du générateur"
            hint="Les variables context et node sont disponibles pour référencer le contexte audio et le noeud"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn type="submit" color="primary">Valider</v-btn>
          <v-btn color="error" @click="creationDialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Generator } from '~/types/Generator';

const emit = defineEmits<{ submitted: [generator: Generator]}>()

const generator: Ref<Generator> = ref({name: "", code: "", id: ""});
const creationDialog: Ref<boolean> = ref(false);
const validForm: Ref<boolean> = ref(true);

function create() {
  emit('submitted', generator.value);
  generator.value = {name: "", code: "", id: ""};
  creationDialog.value = false;
}
</script>