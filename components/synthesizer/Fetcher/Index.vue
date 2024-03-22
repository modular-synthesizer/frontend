<template>
  <template v-if="synthesizers.length > 0">
    <slot :synthesizers="synthesizers"></slot>
  </template>
</template>

<script setup lang="ts">
import { api } from '~~/lib/api/Api';
import ISynthesizer from '~~/lib/interfaces/ISynthesizer';

const synthesizers: ISynthesizer[] = await api.auth_get("/synthesizers");
</script>