<template>
  <v-data-table v-if="rights" :headers="headers" :items="rights" :density="density">
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.columns.id }}</td>
        <td>{{ item.columns.label }}</td>
        <td>
          <slot :right="item.raw"></slot>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import IRight from '~~/lib/interfaces/permissions/IRight';
import { useRights } from '~~/stores/permissions/rights';

export default {
  name: "RightsTable",
  props: {
    density: {
      type: String,
      default: '',
    },
    rights: {
      type: Array<IRight>,
      default: () => [],
    },
  },
  computed: {
    headers() {
      return [
        { 'title': this.$t('common.uuid'), key: 'id' },
        { 'title': this.$t('common.label'), key: 'label' },
        { 'title': this.$t('common.actions') },
      ]
    },
  },
}
</script>

<script lang="ts" setup>
useRights().init();
</script>