<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">{{ $t('common.add') }}</v-btn>
    </template>
    <v-form @submit.prevent="create" v-model="validity" ref="form">
      <v-card class="mx-auto" width="50%">
        <template v-slot:title>{{ $t('groups.dialog.title')}}</template>
        <v-card-text>
          {{ group }}
          <v-text-field
            variant="outlined"
            density="compact"
            label="Nom du groupe"
            hint="Ce nom sera utilisé en tant que clef de traduction"
            v-model="group.slug"
          />
          <v-switch v-model="group.is_default" label="groupe par défaut" inset color="primary" />
          {{ rights.all() }}
          <RightsTable v-slot="{ right }" density="compact" :rights="rights.all()">
            
            <!--v-switch
              class="without-messages"
              inset
              color="primary"
              density="compact"
              :value="right.id"
              :v-model="group.rights" /-->
          </RightsTable>
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
import IGroup from '~~/lib/interfaces/permissions/IGroup';

const emit = defineEmits(['submitted']);
const rights = ref(await useLists().rights);
const group: IGroup = { id: "", slug: "", rights: [], is_default: false };
const dialog = ref(false);
const validity = ref(true);

function create() {
  emit('submitted', group);
  dialog.value = false;
}
</script>