<template>
  <structure-anonymous-menu />
  <!-- This makes the application wait for the token to be refreshed before display-->
  <v-main class="d-flex flex-column">
    <slot></slot>
  </v-main>
</template>