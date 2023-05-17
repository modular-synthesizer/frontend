<template>
  <v-app-bar color="primary">
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