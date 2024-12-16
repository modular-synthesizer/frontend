<template>
  <template v-for="port in ports">
    <tool-structure-port
      :port="port"
      :selected="port.id === selected.item?.id"
      @select="selectItem(port, 'ports', tool)"
      @edit="editPort"
      :tool="tool"
    />
  </template>
</template>

<script lang="ts" setup>
import type { Tool } from '~~/types/tools/Tool';
import type { ToolPort } from '~~/types/tools/Port';

const { tool } = defineProps({
  ports: { type: Array<ToolPort>, default: [] },
  tool: { type: Object as PropType<Tool>, required: true }
})

const emit = defineEmits<{ edit: [ item: ToolPort ] }>()

function editPort(port: ToolPort) {
  emit('edit', port)
}
</script>