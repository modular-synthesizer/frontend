<template>
  <v-table>
    <thead>
      <tr>
        <th id="uuid">{{ t('common.uuid') }}</th>
        <th id="name">{{ t('common.name') }}</th>
        <th id="slots">{{ t('tools.headers.slots') }}</th>
        <th id="actions">{{ t('common.actions') }}</th>
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