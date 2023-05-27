<template>
  <v-app-bar color="primary" v-if="mobile">
    <template v-slot:prepend>
      <v-app-bar-title class="mr-2 ml-2">Synple</v-app-bar-title>
    </template>
    <template v-slot:append>
      <v-dialog fullscreen height="100%" v-model="menuModel">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props"><v-icon>mdi-menu</v-icon></v-btn>
        </template>
        <v-list height="100%">
          <v-list-item>
            <template v-slot:append>
              <v-list-item-action>
                <v-btn variant="text" icon @click="menuModel = false"><v-icon>mdi-close</v-icon></v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item href="/register">
            <v-list-item-title class="pl-2">{{ $t('common.register') }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item href="/login">
            <v-list-item-title class="pl-2">{{ $t('common.login') }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>
      </v-dialog>
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
import { useDisplay } from 'vuetify/lib/framework.mjs';

const mobile = computed(() => useDisplay().smAndDown.value);
const menuModel = ref(false);
</script>