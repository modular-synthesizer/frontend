<template>
  <Head>
    <Title>Synple</Title>
    <Meta name="description" content="A modular synthesizer edition engine" />
  </Head>
  <v-app>
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

useCoordinates().initUpdates();

window.addEventListener("beforeunload", () => {
  closeWebsocket();
  useKeyboardEvents().cancel();
});
</script>

<style>
html { overflow: auto; }
</style>