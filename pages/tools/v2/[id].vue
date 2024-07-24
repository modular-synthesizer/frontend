<template>
  <v-container>
    <v-tabs v-model="tab" align-tabs="center" color="secondary">
      <v-tab value="internal">Internal structure</v-tab>
      <v-tab value="external">External appearance</v-tab>
    </v-tabs>
    <div class="pt-2 tabs-holder">
      <v-window v-model="tab">
        <v-window-item value="internal">
          <tool-structure />
        </v-window-item>
        <v-window-item value="external">
          <tool-appearance />
        </v-window-item>
      </v-window>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
const tab: Ref<string> = ref('internal');
</script>

<style>
.v-container {
  padding: 0px;
}
.tabs-holder {
  height: calc(100vh - 64px - 48px);
  overflow-y: hidden;
}
</style>