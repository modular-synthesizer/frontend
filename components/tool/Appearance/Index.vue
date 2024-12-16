<template>
  <v-row class="main-row no-gutters" v-if="props.tool">
    <v-col cols="12">
      <tool-preview v-model="props.tool" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Tool } from '~~/types/tools/Tool';

const props = defineProps({
  tool: { type: Object as PropType<Tool>, required: true },
  creationMode: { type: Boolean, default: false },
});
</script>

<style scoped lang="scss">
.main-row {
  height: 100%;
  margin: 0;
  padding: 0;

  .v-col {
    margin: 0px;
    padding: 0px;
  }

}
svg {
  height: 100%;
  width: 100%;
}
</style>