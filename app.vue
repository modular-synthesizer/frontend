<template>
  <Head>
    <Title>Synple</Title>
    <Meta name="description" content="A modular synthesizer edition engine" />
  </Head>
  <v-app
    @mousemove="triggerDragMove"
    @touchmove.passive="($event: TouchEvent) => triggerDragMove($event.touches[0] as any)"
  >
    <v-layout>
      <NuxtLayout>
        <NuxtPage />
        <context-handler />
      </NuxtLayout>
    </v-layout>
  </v-app>
</template>

<script lang="ts" setup>
useHead({ htmlAttrs: { lang: 'fr' } });

window.addEventListener("beforeunload", () => {
  closeWebsocket();
  useKeyboardEvents().cancel();
});
</script>

<style>
html { overflow: auto; }
</style>