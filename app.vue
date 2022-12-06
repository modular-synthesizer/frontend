<template>
  <VApp>
    <VLayout>
      <Menu v-if="displayMenu" />
      <!-- This makes the application wait for the token to be refreshed before display-->
      <VMain v-if="displayContent">
        <NuxtPage />
      </VMain>
    </VLayout>
  </VApp>
</template>

<script setup lang="ts">
api.setUri(useRuntimeConfig().public.api_uri);
</script>

<script lang="ts">
import Menu from '~~/components/structure/menu.vue'
import { VLayout, VMain, VApp } from 'vuetify/components'
import { api } from '~~/lib/api/Api'
import { mapActions, mapState } from 'pinia'
import { useAudioContext } from './lib/stores/audioContext'

export default {
  components: { Menu, VApp, VLayout, VMain },
  data: () => ({
    displayInitModal: true
  }),
  methods: {
    ...mapActions(useAuthentication, ['refresh']),
    ...mapActions(useAudioContext, ['initContext']),
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