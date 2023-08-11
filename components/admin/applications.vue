<template>
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
            @click:append-inner="applications.create(application)"
            :hint="$t('applications.hints.name')"
          />
        </form>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table v-if="applications.populated" :headers="headers" :items="applications.all()" item-value="id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const applications = ref(await useLists().applications);
const application = { id: "", name: "" }

const headers = useHeaders(useI18n, [
  {title: 'common.uuid', key: 'id'},
  {title: 'common.name', key: 'name'}
])
</script>