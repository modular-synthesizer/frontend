<template>
  <menu-when-logged v-if="authenticated" />
  <menu-when-anonymous v-else />
  <!-- This makes the application wait for the token to be refreshed before display-->
  <v-main class="d-flex flex-column">
    <slot></slot>
  </v-main>
</template>

<script setup lang="ts">
const authenticated: ComputedRef<boolean> = computed(() => useSession().authenticated);
</script>