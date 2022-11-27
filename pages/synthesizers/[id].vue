<template>
  <div class="wrapper">
    <synthesizer-initializer v-if="!loaded" @interacted="initSoundPipeline" />
    <svg
      v-else
      @mousedown="startDrag(synthesizer, $event.clientX, $event.clientY)"
      @mousemove="mousemove"
      @mouseup="endDrags()"
      @mouseleave="endDrags()"
      @wheel.prevent="setScale($event.deltaY)"
    >
      <SynthesizerComponent :synthesizer="synthesizer" v-if="synthesizer !== null" :mods="mods" :links="links" />
    </svg>
    <v-toolbar collapse density="compact" color="primary">
      <module-creator :tools="tools" :synthesizer="synthesizer" @selected="insertModule" />
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import SynthesizerComponent from "~~/components/synthesizers/Synthesizer.vue"
import { useSynthesizerDrag } from '~~/lib/stores/dragSynthesizer';
import { useZoomStore } from '~~/lib/stores/zoom';
import { useToolsList } from '~~/lib/stores/tools/list';
import { useModDrag } from '~~/lib/stores/mods/dragAndDrop';
import { useSynthesizerDetails } from '~~/lib/stores/synthesizers/details';
import { useGenerators } from '~~/lib/stores/tools/generators';
import { useLinkDrag } from '~~/lib/stores/links/dragAndDrop';
import { useLinksList } from '~~/lib/stores/links/linksList';
import { useAudioContext } from '~~/lib/stores/audioContext';
import { useParameters } from '~~/lib/stores/tools/parameters';
import { useModulesList } from '~~/lib/stores/mods/modsList';
import Synthesizer from '~~/lib/wrappers/Synthesizer';
import Mod from '~~/lib/wrappers/Mod';

definePageMeta({
  menu: false
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
    ...mapState(useToolsList, ['tools']),
    ...mapState(useSynthesizerDetails, ['synthesizer']),
    ...mapState(useLinksList, ['links']),
    ...mapState(useModulesList, ['mods']),
  },
  methods: {
    mousemove($event: MouseEvent) {
      const x = $event.clientX;
      const y = $event.clientY;
      this.moveDrag(x, y);
      this.moveModDrag(x, y);
      this.moveLink(x, y);
      this.moveParameterSetting($event)
    },
    ...mapActions(useSynthesizerDrag, {
      startDrag: 'start',
      moveDrag: 'move',
      endDrag: 'end'
    }),
    endDrags() {
      this.endDrag();
      this.endModDrag();
      this.cancelLink();
      this.endParameterSetting();
    },
    ...mapActions(useZoomStore, ['setScale']),
    ...mapActions(useToolsList, ['fetchTools']),
    ...mapActions(useModDrag, ['moveModDrag', 'endModDrag']),
    ...mapActions(useSynthesizerDetails, ['fetchSynthesizer']),
    ...mapActions(useGenerators, ['fetchScripts']),
    ...mapActions(useLinkDrag, ['cancelLink', 'moveLink']),
    ...mapActions(useParameters, ["endParameterSetting", "moveParameterSetting"]),
    insertModule(mod: Mod) {
        this.mods.push(mod);
        this.synthesizer.place(mod.rack, mod.slot, mod);
    },
    async initSoundPipeline() {
      useAudioContext().initContext();
      await useModulesList().fetchModules(this.synthesizer as Synthesizer);
      await useLinksList().fetchLinks();
      this.loaded = true;
    }
  },
  async mounted() {
    useModulesList().resetMods();
    useLinksList().resetLinks();
    this.fetchTools();
    await this.fetchScripts();
    this.fetchSynthesizer(this.$route.params.id as string);
  },
  components: { SynthesizerComponent }
}
</script>

<style scoped>
svg, .wrapper {
  width: 100vw;
  height: 100vh;
  background-color: silver;
  position: absolute;
  top: 0px;
  left: 0px;
}

.welcome-dialog {
  max-width: 50%;
}
</style>