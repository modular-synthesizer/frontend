<template>
  <template v-if="generators">
    <GeneratorCreator @submitted="add" />
    <v-data-table :headers="headers" :items="generators" />
  </template>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import GeneratorCreator from './dialogs/GeneratorCreator.vue';
import { repositories } from '~~/lib/repositories';
import { IGenerator } from '~~/lib/interfaces/IGenerator';

const headers = useHeaders(useI18n, [
  { 'title': 'common.uuid', key: 'id' },
  { 'title': 'common.name', key: 'name' },
  { 'title': 'code', key: 'code' },
]);

const { generators: repo } = repositories;
const generators: Ref<IGenerator[]> = ref(await repo.list());
const add = repo.add(generators.value);
</script>