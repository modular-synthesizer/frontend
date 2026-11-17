<template>
  <v-data-table v-if="rights" :headers="headers" :items="rights" density="comfortable">
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.label }}</td>
        <td>
          <slot :right="item.label"></slot>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { Right } from '~/types/permissions/Right';

const { rights = [] } = defineProps<{ rights: Right[] }>();

const headers = useHeaders(useI18n, [
  { 'title': 'common.uuid', key: 'id' },
  { 'title': 'common.label', key: 'label' },
  { 'title': 'common.actions' },
]);
</script>