<template>
  <div class="wrapper synthesizer-wrapper">
    <synthesizer-initializer v-if="!loaded" :id="id" />
    <synthesizer-stage :id="id" />
    <v-toolbar collapse density="compact" color="deep-purple darken-2">
      <v-btn icon to="/synthesizers">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <module-creator :tools="tools" :synthesizer="synthesizer" @selected="insertModule" />
    </v-toolbar>
  </div>
</template>

<script setup lang="ts">
import ITool from '~~/lib/interfaces/ITool';
import { eventbus } from '~~/lib/utils/eventbus/EventBus';
import Mod from '~~/lib/wrappers/Mod';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

definePageMeta({
  layout: false,
  menu: false,
  middleware: ['websockets'],
})

const id: string = useRoute().params.id as string;

const loaded: Ref<Boolean> = ref(false);
const tools: ITool[] = []; // await api.auth_get('/tools');
const synthesizer: Ref<Synthesizer> = ref(await make_get(`/synthesizers/${id}`));

onBeforeUnmount(() => {
  eventbus.emit('synthesizers/quit')
  useSynthesizerDetails().reset();
  usePorts().reset();
  useModulesList().reset();
  useLinksList().reset();
  stopManagers();
  useAudioContext().context?.suspend();
});

onMounted(async () => {
  await useAudioContext().context?.suspend();
});

function insertModule(mod: Mod) {
  useModulesList().modules.push(mod);
  useSynthesizerDetails().synthesizer.place(mod.rack, mod.slot, mod);
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