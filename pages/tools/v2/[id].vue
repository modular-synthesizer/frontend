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
          <div class="tabs-holder"><tool-appearance /></div>
        </v-window-item>
      </v-window>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { api } from '~~/lib/api/Api';
import ITool from '~~/lib/interfaces/ITool';

definePageMeta({ layout: 'empty' });
const tab: Ref<string> = ref('internal');
const tool: Ref<ITool> = ref(await api.auth_get(`/tools/${useRoute().params.id}`));

async function save() {
  tool.value = await api.auth_put(`/tools/${useRoute().params.id}`, tool.value)
}
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