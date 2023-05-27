<template>
  <v-app-bar color="primary" v-if="useDisplay().smAndDown.value">
    <template v-slot:prepend>
      <v-app-bar-title class="mr-2 ml-2">Synple</v-app-bar-title>
    </template>
    <template v-slot:append>
      <menu-burger :items="items" />
    </template>
  </v-app-bar>
  <v-app-bar color="primary" v-else>
    <template v-slot:prepend>
      <v-app-bar-title class="mr-2">Synple</v-app-bar-title>
      <v-btn icon to="/"><v-icon>mdi-home</v-icon></v-btn>
    </template>
    <template v-slot:append>
      <v-btn to="/register">{{ $t('common.register') }}</v-btn>
      <v-btn to="/login">{{ $t('common.login') }}</v-btn>
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