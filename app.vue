<template>
  <v-app>
    <v-layout>
      <main-menu v-if="displayMenu" />
      <!-- This makes the application wait for the token to be refreshed before display-->
      <v-main v-if="displayContent" class="d-flex flex-column">
        <nuxt-page />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'

export default {
  data: () => ({
    displayInitModal: true
  }),
  methods: {
    ...mapActions(useAuthentication, ['refresh']),
  },
  computed: {
    ...mapState(useAuthentication, ['session']),
    displayContent() {
      return useRoute().meta.authenticated === false || this.session.token !== ''
    },
    displayMenu() {
      return useRoute().meta.menu !== false;
    }
  },
  async mounted() {
    this.refresh();
  }
}
</script>

<style lang="scss">
html {
  overflow-y: hidden;
}
</style>