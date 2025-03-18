<template>
  <template v-if="generators">
    <v-data-table :headers="headers" :items="generators" />
  </template>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { repositories } from '~~/lib/repositories';
import type { Generator } from '~/types/Generator';

const headers = useHeaders(useI18n, [
  { 'title': 'common.uuid', key: 'id' },
  { 'title': 'common.name', key: 'name' },
  { 'title': 'code', key: 'code' },
]);

const generators: Ref<Generator[]> = ref(await repositories.generators.list(useSession().token));
</script>