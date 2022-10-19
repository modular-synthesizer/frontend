<template>
  <!-- This makes the application wait for the token to be refreshed before display-->
  <VApp v-if="session.token !== ''">
    <VLayout>
      <Menu></Menu>
      <VMain>
        <NuxtPage />
      </VMain>
    </VLayout>
  </VApp>
</template>

<script lang="ts">
import Menu from '~~/components/structure/menu.vue'
import { VLayout, VMain, VApp } from 'vuetify/components'
import { api } from '~~/lib/api/Api'
import { mapActions, mapState } from 'pinia'
import { useAuthentication } from './lib/stores/authentication'

export default {
  components: { Menu, VApp, VLayout, VMain },
  setup() {
    api.setUri(useRuntimeConfig().public.api_uri);
  },
  methods: {
    ...mapActions(useAuthentication, ['refresh'])
  },
  computed: {
    ...mapState(useAuthentication, ['session'])
  },
  mounted() {
    this.refresh();
  }
}
</script>