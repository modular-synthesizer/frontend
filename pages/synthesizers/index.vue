<template>
  <v-container>
    <synthesizer-creator />
    <synthesizer-list :type="['creator']" title="synthesizers.list.owned" />
    <synthesizer-list :type="['read', 'write']" title="synthesizers.list.others" />
  </v-container>
</template>

<script lang="ts" setup>
// This middleware is declared because this page does not use layout.
definePageMeta({ middleware: ['websockets'] });
</script>