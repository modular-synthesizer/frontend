<template>
  <template v-if="applications">
    <v-container class="mt-2">
      <v-row>
        <v-col xs="12" sm="8" offset-sm="2" md="6" offset-md="3">
          <form @submit.prevent="add">
            <v-text-field
              density="compact"
              variant="outlined"
              v-model="application.name"
              :label="$t('applications.labels.name')"
              append-inner-icon="mdi-plus"
              @click:append-inner="add(application)"
              :hint="$t('applications.hints.name')"
            />
          </form>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table :headers="headers" :items="applications" item-value="id" />
        </v-col>
      </v-row>
    </v-container>
  </template>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import IApplication from '~~/lib/interfaces/IApplication';
import { repositories } from '~~/lib/repositories';
const application = { id: "", name: "" }

const headers = useHeaders(useI18n, [
  {title: 'common.uuid', key: 'id'},
  {title: 'common.name', key: 'name'}
]);

const applications: Ref<IApplication[]> = ref(await repositories.applications.list());
const add = repositories.applications.add(applications.value);
</script>