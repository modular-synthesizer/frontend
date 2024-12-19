<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">{{ $t('common.add') }}</v-btn>
    </template>
    <v-form @submit.prevent="create" v-model="validity" ref="form">
      <v-card class="mx-auto" width="50%">
        <template v-slot:title>{{ $t('groups.dialog.title')}}</template>
        <v-card-text>
          <v-text-field
            variant="outlined"
            density="compact"
            label="Nom du groupe"
            hint="Ce nom sera utilisé en tant que clef de traduction"
            v-model="group.slug"
          />
          <v-switch v-model="group.is_default" label="groupe par défaut" inset color="primary" />
          <v-row class="rights-row mb-4">
            <v-col cols="6" v-for="right in rights">
              <v-checkbox color="primary" v-model="group.scopes" :value="right.id" :label="right.label" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn type="submit" color="primary">Valider</v-btn>
          <v-btn color="error" @click="dialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Group } from '~/types/permissions/Group';
import { repositories } from '~~/lib/repositories';

const emit = defineEmits(['submitted']);
const rights = ref(await repositories.rights.list());
const group: Ref<Group> = ref({ id: "", slug: "", scopes: [], is_default: false });
const dialog = ref(false);
const validity = ref(true);

function create() {
  emit('submitted', group.value);
  dialog.value = false;
}
</script>

<style>
.rights-row .v-input__control {
  height: 36px;
}
.rights-row .v-input__details {
  display: none;
}
.rights-row .v-col {
  padding: 0px;
}
</style>