<template>
  <menu-when-logged />
  <!-- This makes the application wait for the token to be refreshed before display-->
  <v-main class="d-flex flex-column">
    <slot></slot>
  </v-main>
</template>

<script setup lang="ts">
useWebsockets();
</script>