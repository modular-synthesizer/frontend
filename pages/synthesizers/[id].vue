<template>
  <div class="wrapper synthesizer-wrapper">
    <synthesizer-initializer v-if="!loaded" :loading="loading" @interacted="initialize" :id="id" />
    <template v-else>
      <synthesizer-stage v-if="synthesizer !== null" :synthesizer="synthesizer" :modules="modules" :links="links" />
      <synthesizer-menu @inserted="insertModule" :synthesizer="synthesizer" :tools="tools" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Tool } from '~~/types/tools/Tool';
import { repositories } from '~~/lib/repositories';
import Mod from '~~/lib/wrappers/Mod';

// @ts-ignore
definePageMeta({
  layout: false,
  menu: false,
  middleware: ['websockets'],
})

const id: string = useRoute().params.id as string;

const loaded: Ref<boolean> = ref(false);
const loading: Ref<boolean> = ref(false);
const tools: Tool[] = await repositories.tools.list();
await useSynthesizer().fetch(id);
const { modules, links, synthesizer } = useSynthesizer();

onBeforeUnmount(useSynthesizer().stop);

onMounted(async () => {
  await useAudio().context?.suspend();
});

function insertModule(mod: Mod) {
  if(synthesizer.value === null) return;
  modules.value.push(mod);
  synthesizer.value.place(mod.rack, mod.slot, mod);
}

async function initialize() {
  loading.value = true;
  await useSynthesizer().initialize();
  loaded.value = true;
}
</script>

<style>
html {
  overscroll-behavior: none;
}
</style>

<style scoped>
svg, .wrapper {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
}
.menu-wrapper {
  position: absolute;
}

body, #__nuxt {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow-y: hidden;
}
.body {
  z-index: 1;
}

#__nuxt {
  z-index: 2;
  overscroll-behavior: none;
}
</style>