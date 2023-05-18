<template>
  <VApp>
    <VLayout>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </VLayout>
  </VApp>
</template>

<script lang="ts">
import Menu from '~~/components/structure/menu.vue'
import { VLayout, VMain, VApp } from 'vuetify/components'

export default {
  components: { Menu, VApp, VLayout, VMain },
  computed: {
    displayMenu() {
      return useRoute().meta.menu !== false;
    }
  },
  mounted() {
    useAuthentication().refresh();
  }
}
</script>