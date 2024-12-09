<template>
  <div class="wrapper synthesizer-wrapper">
    <synthesizer-initializer v-if="!loaded" :loading="loading" @interacted="initialize" :id="id" />
    <template v-else>
      <synthesizer-stage v-if="synthesizer !== null" :synthesizer="synthesizer" :modules="modules" :links="links" />
      <v-btn-group divided class="position-absolute menu-btn-group" color="deep-purple darken-2" rounded="pill">
        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <v-btn icon to="/synthesizers" v-bind="props">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </template>
          <span>Revenir à la liste</span>
        </v-tooltip>
        <module-creator :tools="tools" :synthesizer="synthesizer" @selected="insertModule" />
        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <v-btn icon @click="useLinksDisplay().toggle()" v-bind="props">
              <v-icon>{{ useLinksDisplay().displayed.value ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}</v-icon>
            </v-btn>
          </template>
          <span v-if="useLinksDisplay().displayed.value">Cacher les cables</span>
          <span v-else>Afficher les cables</span>
        </v-tooltip>
        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <v-btn icon @click="useSynthesizer().resetReference()" v-bind="props">
              <v-icon>mdi-compass-outline</v-icon>
            </v-btn>
          </template>
          <span>Revenir à l'origine</span>
        </v-tooltip>
      </v-btn-group>
    </template>
  </div>
</template>

<script setup lang="ts">
import ITool from '~~/lib/interfaces/ITool';
import { repositories } from '~~/lib/repositories';
import Mod from '~~/lib/wrappers/Mod';

definePageMeta({
  layout: false,
  menu: false,
  middleware: ['websockets'],
})

const id: string = useRoute().params.id as string;

const loaded: Ref<boolean> = ref(false);
const loading: Ref<boolean> = ref(false);
const tools: ITool[] = await repositories.tools.list();
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

.menu-btn-group {
  top: 30px;
  left: 30px;
}
</style>