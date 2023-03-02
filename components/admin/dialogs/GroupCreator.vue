<template>
  <v-dialog v-model="creationDialog">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">{{ $t('common.add') }}</v-btn>
    </template>
    <v-form @submit.prevent="create" v-model="validForm" ref="form">
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
          <RightsTable v-slot="{ right }" density="compact" :rights="rights">
            
            <v-switch
              class="without-messages"
              inset
              color="primary"
              density="compact"
              :value="right.id"
              :v-model="group.rights" />
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

<script lang="ts">
import RightsTable from "../utils/RightsTable.vue";
import RightSelector from '../utils/RightSelector.vue'
import IGroup from '~~/lib/interfaces/permissions/IGroup';

export default {
  components: { RightSelector, RightsTable },
  data: () => ({
    group: { slug: '', rights: [], is_default: false } as IGroup,
    creationDialog: false,
    validForm: true,
  }),
  computed: {
    ...mapState(useRights, ['rights'])
  },
  methods: {
    create() {
      this.$emit('submitted', this.group);
      this.creationDialog = false;
    }
  }
}
</script>

<script setup lang="ts">
import { mapState } from 'pinia';
import IRight from '~~/lib/interfaces/permissions/IRight';

await useRights().init();
</script>