<template>
  <v-app-bar color="primary">
    <template v-slot:prepend>
      <v-app-bar-title class="mr-2 hidden-sm-and-down">Synple</v-app-bar-title>
      <v-btn icon to="/"><v-icon>mdi-home</v-icon></v-btn>
      <v-btn icon to="/synthesizers" v-if="authenticated">
        <v-icon>mdi-piano</v-icon>
      </v-btn>
    </template>
    <template v-slot:append>
      <div class="hidden-md-and-up">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item to="/admin/sandbox" v-if="admin">
              <v-list-item-title>Sandbox</v-list-item-title>
            </v-list-item>
            <v-list-item to="/tools" v-if="admin">
              <v-list-item-title>Outils</v-list-item-title>
            </v-list-item>
            <v-list-item to="/admin" v-if="admin">
              <v-list-item-title>Administration</v-list-item-title>
            </v-list-item>
            <v-divider v-if="authenticated"></v-divider>
            <v-list-item  @click="logout" v-if="authenticated">
              <v-list-item-title>Se déconnecter</v-list-item-title>
            </v-list-item>
            <template v-else>
              <v-list-item to="/register">
                <v-list-item-title>{{ $t('common.register') }}</v-list-item-title>
              </v-list-item>
              <v-list-item to="/login">
                <v-list-item-title>{{ $t('common.login') }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </div>
      <div class="hidden-sm-and-down">
        <v-btn v-if="admin" to="/admin/sandbox">Sandbox</v-btn>
        <v-btn to="/tools" v-if="admin">Outils</v-btn>
        <v-btn to="/admin" v-if="admin">{{ $t('common.admin') }}</v-btn>
        <v-btn @click="logout" v-if="authenticated">{{ $t('common.logout') }}</v-btn>
        <template v-else>
          <v-btn to="/register">{{ $t('common.register') }}</v-btn>
          <v-btn to="/login">{{ $t('common.login') }}</v-btn>
        </template>
      </div>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';

export default {
  name: 'MainMenu',
  computed: {
    ...mapState(useAuthentication, ['authenticated', 'admin']),
  },
  methods: {
    ...mapActions(useAuthentication, ['logout'])
  }
}
</script>