<template>
  <data-fetcher url="/generators">
    <template v-slot="{ items: generators, add }">
      <GeneratorCreator @submitted="add" />
      <v-data-table :headers="headers" :items="generators" />
    </template>
  </data-fetcher>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import GeneratorCreator from './dialogs/GeneratorCreator.vue';

const headers = useHeaders(useI18n, [
  { 'title': 'common.uuid', key: 'id' },
  { 'title': 'common.name', key: 'name' },
  { 'title': 'code', key: 'code' },
]);
</script>