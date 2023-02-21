<template>
  <VApp>
    <VLayout>
      <Menu v-if="displayMenu" />
      <!-- This makes the application wait for the token to be refreshed before display-->
      <VMain v-if="displayContent" class="d-flex flex-column">
        <NuxtPage />
      </VMain>
    </VLayout>
  </VApp>
</template>

<script lang="ts">
import Menu from '~~/components/structure/menu.vue'
import { VLayout, VMain, VApp } from 'vuetify/components'
import { mapActions, mapState } from 'pinia'

export default {
  components: { Menu, VApp, VLayout, VMain },
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