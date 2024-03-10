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
  <parameter-editor />
</template>

<script lang="ts">
import { mapState } from 'pinia';
import ITool from '~~/lib/interfaces/ITool';
import { eventbus } from '~~/lib/utils/eventbus/EventBus';
import Mod from '~~/lib/wrappers/Mod';

definePageMeta({
  layout: false,
  menu: false,
  middleware: ['check-authentication', 'websockets'],
})
export default {
  data() {
    return {
      displayCreator: false,
      generators: [] as string[],
      displayInitModal: true,
      loading: false,
      loaded: false,
      tools: [] as ITool[],
    };
  },
  computed: {
    id(): string {
      return this.$route.params.id as string;
    },
    ...mapState(useSynthesizerDetails, ['synthesizer']),
    ...mapState(useModulesList, ['modules']),
  },
  methods: {
    insertModule(mod: Mod) {
      this.modules.push(mod);
      this.synthesizer.place(mod.rack, mod.slot, mod);
    },
  },
  async mounted() {
    await useAudioContext().context?.suspend();
    this.tools = (await useLists().tools).all();
  },
  beforeUnmount() {
    eventbus.emit('synthesizers/quit')
    useSynthesizerDetails().reset();
    usePorts().reset();
    useModulesList().reset();
    useLinksList().reset();
    stopManagers();
    useAudioContext().context?.suspend();
  }
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