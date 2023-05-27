<template>
  <v-app-bar color="deep-purple darken-2" v-if="useDisplay().smAndDown.value">
      <v-btn icon to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon to="/synthesizers" class="ml-2">
        <v-icon>mdi-piano</v-icon>
      </v-btn>
    <template v-slot:append>
      <menu-burger :items="items" />
    </template>
  </v-app-bar>
  <v-app-bar color="deep-purple darken-2" v-else>
    <template v-slot:prepend>
      <v-app-bar-title class="mr-2">Synple</v-app-bar-title>
      <v-btn icon to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn variant="text" to="/synthesizers" class="ml-2">Synthétiseurs</v-btn>
    </template>
    <template v-slot:append>
      <template v-if="useAuthentication().admin">
        <v-btn to="/admin/sandbox">Sandbox</v-btn>
        <v-btn to="/tools" >Outils</v-btn>
        <v-btn to="/admin">{{ $t('common.admin') }}</v-btn>
      </template>
      <v-btn @click="useAuthentication().logout">{{ $t('common.logout') }}</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';

const items = [
  ...(!useAuthentication().admin ? [] : [
    { label: 'menus.sandbox', url: '/admin/sandbox' },
    { label: 'menus.tools', url: '/tools' },
    { label: 'common.admin', url: '/admin' },
  ]),
  { click: useAuthentication().logout, label: 'common.logout' },
];
</script>