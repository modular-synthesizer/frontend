<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps({
  error: Object as PropType<NuxtError>
});
</script>

<template>
  <div>
    <h1>{{ error?.statusCode }}</h1>
    <h3>{{ error?.message }}</h3>
    <pre>{{ error?.stack }}</pre>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>