<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps({
  error: Object as PropType<NuxtError>
})

console.log(error);
</script>

<template>
  <div>
    <h1>{{ error?.statusCode }}</h1>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>