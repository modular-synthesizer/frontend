<template>
  <Head>
    <Title>Synple</Title>
    <Meta name="description" content="A modular synthesizer edition engine" />
  </Head>
  <VApp>
    <VLayout>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </VLayout>
  </VApp>
</template>

<script lang="ts">
import { VLayout, VMain, VApp } from 'vuetify/components'

export default {
  components: { VApp, VLayout, VMain },
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