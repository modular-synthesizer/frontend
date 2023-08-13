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

<script lang="ts" setup>
import { VLayout, VApp } from 'vuetify/components'

useHead({
  htmlAttrs: { lang: 'fr' }
});

useAuthentication().refresh();

window.addEventListener("beforeunload", () => closeWebsocket());
</script>