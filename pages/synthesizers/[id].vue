<template>
  <div class="wrapper">
    <synthesizer-initializer v-if="!loaded" :id="id" />
    <synthesizer-stage :id="id" />
    <v-toolbar collapse density="compact" color="primary">
      <v-btn @mousedown="leaving" icon to="/synthesizers">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <module-creator :tools="tools" :synthesizer="synthesizer" @selected="insertModule" />
    </v-toolbar>
    <module-context />
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import Mod from '~~/lib/wrappers/Mod';

definePageMeta({
  layout: false,
  menu: false,
  middleware: ['check-authentication'],
})
export default {
  data() {
    return {
      displayCreator: false,
      generators: [] as string[],
      displayInitModal: true,
      loading: false,
      loaded: false,
    };
  },
  computed: {
    id(): string {
      return this.$route.params.id as string;
    },
    ...mapState(useToolsList, ['tools']),
    ...mapState(useSynthesizerDetails, ['synthesizer']),
    ...mapState(useModulesList, ['modules']),
  },
  methods: {
    ...mapActions(useToolsList, ['fetchTools']),
    insertModule(mod: Mod) {
      this.modules.push(mod);
      this.synthesizer.place(mod.rack, mod.slot, mod);
    },
    leaving() {
      useSynthesizerDetails().reset();
      usePorts().reset();
      useModulesList().reset();
      useLinksList().reset();
      stopManagers();
      useAudioContext().context?.suspend();
    }
  },
  async mounted() {
    await useAudioContext().context?.suspend();
    this.fetchTools();
    await useGenerators().fetchGenerators();
  },
  beforeUnmount() {
    this.leaving();
  }
}
</script>

<style scoped>
svg, .wrapper {
  width: 100vw;
  height: 100vh;
  background-color: #555555;
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