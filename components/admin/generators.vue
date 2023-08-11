<template>
  <GeneratorCreator @submitted="generators.create($event)" />
  <v-data-table :headers="headers" :items="generators.all()" />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import GeneratorCreator from './dialogs/GeneratorCreator.vue';

const generators = ref(await useLists().generators);

const headers = useHeaders(useI18n, [
  { 'title': 'common.uuid', key: 'id' },
  { 'title': 'common.name', key: 'name' },
  { 'title': 'code', key: 'code' },
]);
</script>