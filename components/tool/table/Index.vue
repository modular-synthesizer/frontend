<template>
  <v-table>
    <thead>
      <tr>
        <th>{{ t('common.uuid') }}</th>
        <th>{{ t('common.name') }}</th>
        <th>{{ t('tools.headers.slots') }}</th>
        <th>{{ t('common.actions') }}</th>
      </tr>
    </thead>
    <tbody>
      <slot></slot>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>