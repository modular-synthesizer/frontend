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
import ITool, { IToolPort } from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  ports: { type: Array<IToolPort>, default: [] },
  tool: { type: Object as PropType<ITool>, required: true }
})

const emit = defineEmits<{ edit: [ item: IToolPort ] }>()

function editPort(port: IToolPort) {
  emit('edit', port)
}
</script>