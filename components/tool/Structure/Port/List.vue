<template>
  <template v-for="port in tool.ports">
    <tool-structure-port
      v-if="port.id !== selected.item?.id"
      :port="port"
      :selected="false"
      @select="selectItem(port, 'ports', tool)"
      :tool="tool"
    />
  </template>
  <tool-structure-port
    v-if="selected.item !== null && selected.uri === 'ports'"
    :port="selected.item"
    :selected="true"
    @select="selectItem(null)"
    :tool="tool"
  />
</template>

<script lang="ts" setup>
import ITool from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
})
</script>