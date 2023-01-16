<template>
  <tools-creator v-model="tool" @update:model-value="saveTool" />
</template>

<script lang="ts">
import ToolsFactory from '~~/lib/factories/ToolsFactory';

export default {
  data: () => ({
    tool: ToolsFactory.empty()
  }),
  methods: {
    saveTool() {
      console.log(this.tool);
    }
  }
}
</script>