<template>
  <VApp>
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

export default {
  components: { Menu, VApp, VLayout, VMain }
}
</script>