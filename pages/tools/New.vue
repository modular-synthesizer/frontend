<template>
  <tools-creator v-model="tool" />
</template>

<script lang="ts">
import ToolsFactory from '~~/lib/factories/ToolsFactory';

export default {
  data: () => ({
    tool: ToolsFactory.empty()
  })
}
</script>