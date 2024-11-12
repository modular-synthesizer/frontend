<template>
  <div class="wrapper synthesizer-wrapper">
    <synthesizer-initializer v-if="!loaded" :loading="loading" @interacted="initialize" :id="id" />
    <template v-else>
      <synthesizer-stage v-if="synthesizer !== null" :synthesizer="synthesizer" :modules="modules" :links="links" />
      <v-toolbar collapse density="compact" color="deep-purple darken-2">
        <v-btn icon to="/synthesizers">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <module-creator :tools="tools" :synthesizer="synthesizer" @selected="insertModule" />
      </v-toolbar>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useSynthesizerDetails } from '~~/composables/synthesizers/details';
import ITool from '~~/lib/interfaces/ITool';
import Mod from '~~/lib/wrappers/Mod';

definePageMeta({
  layout: false,
  menu: false,
  middleware: ['websockets'],
})

const id: string = useRoute().params.id as string;

const loaded: Ref<Boolean> = ref(false);
const loading: Ref<Boolean> = ref(false);
const tools: ITool[] = await api_get('/tools');
await useSynthesizerDetails().fetch(id);
const { modules, links, synthesizer } = useSynthesizerDetails();

onBeforeUnmount(useSynthesizerDetails().stop);

onMounted(async () => {
  await useAudioContext().context?.suspend();
});

function insertModule(mod: Mod) {
  if(synthesizer.value === null) return;
  modules.value.push(mod);
  synthesizer.value.place(mod.rack, mod.slot, mod);
}

async function initialize() {
  loading.value = true;
  await useSynthesizerDetails().initialize();
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