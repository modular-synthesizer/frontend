<template>
  <v-app-bar color="deep-purple darken-2" v-if="useDisplay().smAndDown.value">
      <v-btn icon to="/" aria-label="home link">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon to="/synthesizers" class="ml-2" aria-label="synthesizers list">
        <v-icon>mdi-piano</v-icon>
      </v-btn>
    <template v-slot:append>
      <menu-burger :items="items" />
    </template>
  </v-app-bar>
  <v-app-bar color="deep-purple darken-2" v-else>
    <template v-slot:prepend>
      <v-app-bar-title class="mr-2">Synple</v-app-bar-title>
      <v-btn icon to="/" aria-label="home link">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn variant="text" to="/synthesizers" class="ml-2">{{ $t('menus.synthesizers') }}</v-btn>
    </template>
    <template v-slot:append>
      <template v-if="hasRight('resources::admin')">
        <v-btn to="/admin/sandbox" aria-label="sandbox link">{{ $t('menus.sandbox') }}</v-btn>
        <v-btn to="/tools" aria-label="tools link">{{ $t('menus.tools') }}</v-btn>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">{{ $t('common.admin') }}</v-btn>
          </template>
          <v-list>
            <v-list-item to="/groups">Groupes</v-list-item>
            <v-list-item to="/admin">Autre</v-list-item>
          </v-list>
        </v-menu>
        
      </template>
      <v-btn @click="useAuthentication().logout">{{ $t('common.logout') }}</v-btn>
      <language-switch />
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