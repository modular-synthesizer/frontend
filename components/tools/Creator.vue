<template>
  <v-container fluid class="main-wrapper">
  <v-tabs v-model="tab" align-tabs="center" color="secondary">
    <v-tab value="internal">Internal structure</v-tab>
    <v-tab value="external">External appearance</v-tab>
  </v-tabs>
  <div class="wrapper">
  </div>
    <div class="pt-2" v-if="tool">
      <v-window v-model="tab">
        <v-window-item value="internal">
          <div class="tabs-holder"><tool-structure :tool="tool" /></div>
        </v-window-item>
        <v-window-item value="external">
          <div class="tabs-holder"><tool-appearance :tool="tool" /></div>
        </v-window-item>
      </v-window>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import ITool from '~~/lib/interfaces/ITool';

const props = defineProps({
  tool: { type: Object as PropType<ITool>, required: true },
})

const tab: Ref<string> = ref('internal');
const tool: Ref<ITool> = ref(props.tool);
</script>

<style scoped>
.main-wrapper {
  padding: 0px 20px;
}
.tabs-holder {
  height: calc(100vh - 56px);
  overflow-y: hidden;
}
.wrapper {
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
}
.menu-wrapper {
  position: absolute;
}
</style>