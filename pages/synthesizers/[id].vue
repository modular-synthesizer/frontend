<template>
  <div class="wrapper">
    <svg
      @mousedown="startDrag(synthesizer, $event.clientX, $event.clientY)"
      @mousemove="moveDrag($event.clientX, $event.clientY)"
      @mouseup="endDrag()"
      @mouseleave="endDrag()"
      @wheel.prevent="setScale($event.deltaY)"
    >
      <SynthesizerComponent :synthesizer="synthesizer" v-if="synthesizer !== null" />
    </svg>
    <v-dialog v-model="displayCreator" fullscreen>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon class="create-button" color="secondary">
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
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { api } from "~~/lib/api/Api";
import Synthesizer from '~~/lib/wrappers/Synthesizer';
import SynthesizerComponent from "~~/components/synthesizers/Synthesizer.vue"
import { useSynthesizerDrag } from '~~/lib/stores/dragSynthesizer';
import { useZoomStore } from '~~/lib/stores/zoom';
import { useAuthentication } from '~~/lib/stores/authentication';
import { useToolsList } from '~~/lib/stores/tools/list';
import ITool from '~~/lib/interfaces/ITool';

export default {
  data() {
    return {
      synthesizer: null as Synthesizer || null,
      displayCreator: false,
    };
  },
  computed: {
    ...mapState(useAuthentication, ["session"]),
    ...mapState(useToolsList, ['tools']),
  },
  methods: {
    ...mapActions(useSynthesizerDrag, {
      startDrag: 'start',
      moveDrag: 'move',
      endDrag: 'end'
    }),
    ...mapActions(useZoomStore, ['setScale', 'setSynthesizer']),
    ...mapActions(useToolsList, ['fetchTools']),
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
  mounted() {
    this.fetchTools();
    api.get("/synthesizers/" + this.$route.params.id, { auth_token: this.session.token })
      .then(response => {
        this.synthesizer = new Synthesizer(response);
        this.setSynthesizer(this.synthesizer);
      });
    api.get("/modules", { auth_token: this.session.token, synthesizer_id: this.$route.params.id })
      .then(response => console.log(response))
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
.create-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>