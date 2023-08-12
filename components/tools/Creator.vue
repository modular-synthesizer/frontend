<template>
  <v-row no-gutters>
    <v-col id="preview" cols="4" class="bg-grey-lighten-2 scroll-y">
      <tools-preview v-model="tool" />
      <div class="d-flex justify-space-between flex-grow-1 bottom-liner">
        <v-btn color="green" @click="saveTool">Sauvegarder</v-btn>
        <v-btn color="blue-grey" to="/tools">Retour</v-btn>
      </div>
    </v-col>
    <v-col id="steps" cols="8" class="overflow-hidden d-flex flex-column">
      <div class="flex-grow-0 d-flex flex-column">
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
            <tools-nodes :tool="tool" :creation-mode="creationMode" />
          </v-window-item>
          <v-window-item value="links">
            <tools-links v-model="tool.links" :tool="tool" :creation-mode="creationMode" />
          </v-window-item>
          <v-window-item value="ports">
            <tools-ports v-model="tool" :creation-mode="creationMode" />
          </v-window-item>
          <v-window-item value="parameters">
            <tools-parameters v-model="tool.parameters" :tool="tool" :creation-mode="creationMode" />
          </v-window-item>
          <v-window-item value="controls">
            <tools-controls v-model="tool.controls" :tool="tool" :creation-mode="creationMode" />
          </v-window-item>
        </v-window>
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
    },
  },
  emits: ['update:modelValue'],
  data: () => ({
    currentTab: "informations"
  }),
  computed: {
    tool() { return this.modelValue },
    creationMode() { return this.tool.id === "" }
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
  overflow-y: scroll;
}
#preview {
  margin: 0px;
  padding: 0px;
  overflow: hidden;
  border-right: 2px solid #BBBBBB;
}
.bottom-liner {
  padding: 10px;
}
#steps {
  padding: 10px;
}
</style>