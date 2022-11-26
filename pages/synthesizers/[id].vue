<template>
  <div class="wrapper">
    <v-dialog :persistent="true" v-model="displayInitModal">
      <v-card>
        <template v-slot:title>Blah</template>
        <v-card-actions>
          <v-btn variant="text" @click="initSoundPipeline">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <svg
      @mousedown="startDrag(synthesizer, $event.clientX, $event.clientY)"
      @mousemove="mousemove"
      @mouseup="endDrags()"
      @mouseleave="endDrags()"
      @wheel.prevent="setScale($event.deltaY)"
    >
      <SynthesizerComponent :synthesizer="synthesizer" v-if="synthesizer !== null" :mods="mods" :links="links" />
    </svg>
    <v-toolbar collapse density="compact" color="primary">
      <v-dialog v-model="displayCreator" fullscreen>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Modules</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="displayCreator = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container v-for="(cat_tools, category) in tools">
            <v-row>
              <v-col cols="12">
                <div class="text-h4">{{ $t(`categories.names.${category}`) }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-list>
                  <v-list-item
                    v-for="tool in cat_tools"
                    :key="`${category}.${tool.name}`"
                    :value="tool"
                    :title="$t(`modules.${category}.${tool.name}.title`)"
                    :subtitle="$t(`modules.${category}.${tool.name}.description`)"
                    @click="selectTool(tool)"
                  />
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-overlay v-model="overlay"></v-overlay>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { api } from "~~/lib/api/Api";
import SynthesizerComponent from "~~/components/synthesizers/Synthesizer.vue"
import { useSynthesizerDrag } from '~~/lib/stores/dragSynthesizer';
import { useZoomStore } from '~~/lib/stores/zoom';
import { useAuthentication } from '~~/lib/stores/authentication';
import { useToolsList } from '~~/lib/stores/tools/list';
import ITool from '~~/lib/interfaces/ITool';
import { useModDrag } from '~~/lib/stores/mods/dragAndDrop';
import { useSynthesizerDetails } from '~~/lib/stores/synthesizers/details';
import { useGenerators } from '~~/lib/stores/tools/generators';
import Mod from '~~/lib/wrappers/Mod';
import { useLinkDrag } from '~~/lib/stores/links/dragAndDrop';
import { useLinksList } from '~~/lib/stores/links/linksList';
import { useAudioContext } from '~~/lib/stores/audioContext';
import { useParameters } from '~~/lib/stores/tools/parameters';
import { useModulesList } from '~~/lib/stores/mods/modsList';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

definePageMeta({
  menu: false
})
export default {
  data() {
    return {
      displayCreator: false,
      generators: [] as string[],
      displayInitModal: true,
      overlay: false,
    };
  },
  computed: {
    ...mapState(useAuthentication, ["session"]),
    ...mapState(useToolsList, ['tools']),
    ...mapState(useSynthesizerDetails, ['synthesizer']),
    ...mapState(useLinksList, ['links']),
    ...mapState(useModulesList, ['mods']),
  },
  methods: {
    mousemove($event) {
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
    selectTool(tool: ITool) {
      const payload = {
        auth_token: this.session.token,
        tool_id: tool.id,
        synthesizer_id: this.synthesizer.id,
        ...this.synthesizer.firstFreeSlot(tool.slots),
      };
      if (payload.slot === -1 || payload.rack === -1) {
        this.displayCreator = false;
        return;
      }
      this.overlay = true;
      api.post('/modules', payload).then(response => {
        this.mods.push(new Mod(response));
        this.displayCreator = false;
        this.overlay = false
      })
    },
    async initSoundPipeline() {
      this.displayInitModal = false
      this.overlay = true;
      useAudioContext().initContext();
      await useModulesList().fetchModules(this.synthesizer as Synthesizer);
      await useLinksList().fetchLinks();
      this.overlay = true;
    }
  },
  async mounted() {
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
</style>