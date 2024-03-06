<template>
  <Head>
    <Title>Synple</Title>
    <Meta name="description" content="A modular synthesizer edition engine" />
  </Head>
  <VApp
    @mousemove="triggerDragMove"
    @touchmove="($event) => triggerDragMove($event.touches[0])"
  >
    <VLayout>
      <NuxtLayout>
        <NuxtPage />
        <context-handler />
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