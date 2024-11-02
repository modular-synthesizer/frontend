<template>
  <v-row class="main-row">
    <v-col cols="4">
      <tools-preview v-model="props.tool" />
    </v-col>
    <v-col cols="8">
      <tools-controls v-model="props.tool.controls" :tool="props.tool" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import ITool from '~~/lib/interfaces/ITool';

const props = defineProps({ tool: { type: Object as PropType<ITool>, required: true }})
</script>

<style scoped>
.main-row {
  height: calc(100% - 10px);
}
svg {
  border: 1px solid white;
  height: 100%;
  width: 100%;
}
</style>