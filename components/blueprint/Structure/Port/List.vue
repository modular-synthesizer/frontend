<template>
  <template v-for="port in ports">
    <blueprint-structure-port
      :port="port"
      :selected="port.id === selection.item?.id"
      @select="selection.select(port)"
      @edit="editPort"
      :blueprint="blueprint"
    />
  </template>
</template>

<script lang="ts" setup>
import type { Blueprint } from '~~/types/blueprints/Blueprint';
import type { ToolPort } from '~~/types/blueprints/Port';

const { blueprint } = defineProps({
  ports: { type: Array<ToolPort>, default: [] },
  blueprint: { type: Object as PropType<Blueprint>, required: true }
})

const emit = defineEmits<{ edit: [ item: ToolPort ] }>();

const selection = ref(useSelectables().state.value.ports);

function editPort(port: ToolPort) {
  emit('edit', port)
}
</script>