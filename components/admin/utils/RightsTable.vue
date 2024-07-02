<template>
  <v-data-table v-if="rights" :headers="headers" :items="rights" :density="density">
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.label }}</td>
        <td>
          <slot :right="item.raw"></slot>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import IRight from '~~/lib/interfaces/permissions/IRight';

defineProps({
  density: { type: String, default: 'comfortable' },
  rights: { type: Array<IRight>, default: () => [] },
});

const headers = useHeaders(useI18n, [
  { 'title': 'common.uuid', key: 'id' },
  { 'title': 'common.label', key: 'label' },
  { 'title': 'common.actions' },
]);
</script>