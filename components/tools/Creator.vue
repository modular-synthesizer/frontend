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
        <v-window-item value="nodes">Noeuds</v-window-item>
        <v-window-item value="links">Liens</v-window-item>
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
  data: () => ({
    currentTab: "informations"
  }),
  computed: {
    tool() { return this.modelValue }
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
</style>