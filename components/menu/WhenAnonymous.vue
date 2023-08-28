<template>
  <v-app-bar color="deep-purple darken-2" v-if="useDisplay().smAndDown.value">
    <template v-slot:prepend>
      <v-app-bar-title class="mr-2 ml-2">Synple</v-app-bar-title>
    </template>
    <template v-slot:append>
      <menu-burger :items="items" />
    </template>
  </v-app-bar>
  <v-app-bar color="deep-purple darken-2" v-else>
    <template v-slot:prepend>
      <v-app-bar-title class="mr-2">Synple</v-app-bar-title>
      <v-btn icon to="/" aria-label="home link"><v-icon>mdi-home</v-icon></v-btn>
    </template>
    <template v-slot:append>
      <v-btn to="/register" aria-label="registration link">{{ $t('common.register') }}</v-btn>
      <v-btn to="/login" aria-label="login link">{{ $t('common.login') }}</v-btn>
      <language-switch />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';

const items = [
  { url: '/register', label: 'common.register' },
  { url: '/login', label: 'common.login' },
];
</script>