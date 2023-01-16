<template>
  <v-row n-gutters>
    <v-col id="preview" cols="4" class="bg-grey-lighten-2 scroll-y">
      <tools-preview v-model="tool" />
    </v-col>
    <v-col id="steps" cols="8" class="scroll-y">
      <v-tabs align-tabs="center" v-model="currentTab">
        <v-tab value="informations">Informations</v-tab>
        <v-tab value="nodes">Noeuds</v-tab>
        <v-tab value="links">Liens</v-tab>
        <v-tab value="ports">Ports</v-tab>
        <v-tab value="parameters">Paramètres</v-tab>
        <v-tab value="controls">Contrôles</v-tab>
      </v-tabs>
      <v-window v-model="currentTab">
        <v-window-item value="informations">
          <tools-informations v-model="tool" />
        </v-window-item>
        <v-window-item value="nodes">
          <tools-nodes v-model="tool.nodes" />
        </v-window-item>
        <v-window-item value="links">
          <tools-links v-model="tool.links" />
        </v-window-item>
        <v-window-item value="ports">
          <tools-ports v-model="tool" />
        </v-window-item>
        <v-window-item value="parameters">
          <tools-parameters v-model="tool.parameters" />
        </v-window-item>
        <v-window-item value="controls">
          <tools-controls v-model="tool.controls" />
        </v-window-item>
      </v-window>
      <div class="bottom-liner">
        <v-btn class="absolute" color="secondary" @click="saveTool">Sauvegarder</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { PropType } from "vue";
import ITool from "~~/lib/interfaces/ITool"

export default {
  props: {
    modelValue: {
      type: Object as PropType<ITool>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  data: () => ({
    currentTab: "informations"
  }),
  computed: {
    tool() { return this.modelValue }
  },
  methods: {
    saveTool() {
      this.$emit('update:modelValue', this.modelValue)
    }
  }
}
</script>

<style scoped>
.scroll-y {
  max-height: calc(100vh - 54px);
  overflow-y: auto;
}
#preview {
  margin: 0px;
  padding: 0px;
  overflow: hidden;
  border-right: 2px solid #BBBBBB;
}
#steps {
  padding-bottom: 64px;
}
.bottom-liner {
  width: 100%;
  padding: 10px;
  padding-left: 0;
  position: absolute;
  bottom: 0px;
  background-color: white;
}
</style>