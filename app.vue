<template>
  <VApp>
    <VLayout>
      <Menu></Menu>
      <!-- This makes the application wait for the token to be refreshed before display-->
      <VMain v-if="displayContent">
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
    ...mapState(useAuthentication, ['session']),
    displayContent() {
      return useRoute().meta.authenticated === false || this.session.token !== ''
    }
  },
  mounted() {
    this.refresh();
  }
}
</script>