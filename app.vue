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
import { api } from '~~/lib/api/Api'

export default {
  components: { Menu, VApp, VLayout, VMain },
  setup() {
    api.setUri(useRuntimeConfig().public.api_uri)
    console.log(api)
  }
}
</script>