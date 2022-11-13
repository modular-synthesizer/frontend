<template>
  <div class="wrapper">
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
                <div class="text-h4">{{ category }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-list>
                  <v-list-item
                    v-for="tool in cat_tools"
                    :key="`${category}.${tool.name}`"
                    :value="tool"
                    :title="$t(`modules.creator.tools.${category}.${tool.name}.title`)"
                    :subtitle="$t(`modules.creator.tools.${category}.${tool.name}.description`)"
                    @click="selectTool(tool)"
                  />
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <svg
      @mousedown="startDrag(synthesizer, $event.clientX, $event.clientY)"
      @mousemove="mousemove"
      @mouseup="endDrags()"
      @mouseleave="endDrags()"
      @wheel.prevent="setScale($event.deltaY)"
    >
      <SynthesizerComponent :synthesizer="synthesizer" v-if="synthesizer !== null" :mods="mods" />
    </svg>
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
import IModule from '~~/lib/interfaces/IModule';
import { useModDrag } from '~~/lib/stores/mods/dragAndDrop';
import { useSynthesizerDetails } from '~~/lib/stores/synthesizers/details';
import { useGenerators } from '~~/lib/stores/tools/generators';
import Mod from '~~/lib/wrappers/Mod';

definePageMeta({
  menu: false
})
export default {
  data() {
    return {
      displayCreator: false,
      mods: [] as Mod[],
      generators: [] as string[]
    };
  },
  computed: {
    ...mapState(useAuthentication, ["session"]),
    ...mapState(useToolsList, ['tools']),
    ...mapState(useSynthesizerDetails, ['synthesizer']),
  },
  methods: {
    mousemove($event) {
      const x = $event.clientX;
      const y = $event.clientY;
      this.moveDrag(x, y);
      this.moveModDrag(x, y);
    },
    ...mapActions(useSynthesizerDrag, {
      startDrag: 'start',
      moveDrag: 'move',
      endDrag: 'end'
    }),
    endDrags() {
      this.endDrag();
      this.endModDrag();
    },
    ...mapActions(useZoomStore, ['setScale']),
    ...mapActions(useToolsList, ['fetchTools']),
    ...mapActions(useModDrag, ['moveModDrag', 'endModDrag']),
    ...mapActions(useSynthesizerDetails, ['fetchSynthesizer']),
    ...mapActions(useGenerators, ['fetchScripts']),
    selectTool(tool: ITool) {
      const payload = {
        auth_token: this.session.token,
        tool_id: tool.id,
        synthesizer_id: this.synthesizer.id,
        slot: 0,
        rack: 0
      };
      api.post('/modules', payload).then(response => console.log(response))
    }
  },
  async mounted() {
    this.fetchTools();
    await this.fetchScripts();
    this.fetchSynthesizer(this.$route.params.id);
    api.get("/modules", { auth_token: this.session.token, synthesizer_id: this.$route.params.id })
      .then(response => {
        this.mods = response.map(mod => new Mod(mod));
        response.forEach(mod => {
          this.synthesizer.place(mod.rack, mod.slot, mod)
        });
      });
  },
  components: { SynthesizerComponent }
}
</script>

<style scoped>
svg, .wrapper {
  width: 100%;
  height: 100%;
  background-color: silver;
}
</style>