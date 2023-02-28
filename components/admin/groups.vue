<template>
  <div>{{ groups }}</div>
</template>

<script setup lang="ts">
import { api } from '~~/lib/api/Api';

const groups = await api.auth_get("/groups");
</script>