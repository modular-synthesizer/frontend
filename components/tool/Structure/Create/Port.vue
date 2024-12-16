<template>
  <v-list-item @click="dialog = true">Port</v-list-item>
  <tool-structure-dialogs-port :port="port" :tool="tool" v-model="dialog" @cancelled="cancel" @validated="create" />
</template>

<script setup lang="ts">
import type { Tool } from '~~/types/tools/Tool';
import type { ToolPort } from '~~/types/tools/Port';

const dialog: Ref<boolean> = ref(false);

const port: Ref<ToolPort> = ref(createEmptyPort());

const { tool } = defineProps({
  tool: { type: Object as PropType<Tool>, required: true }
})

const emit = defineEmits<{ created: [ port: ToolPort]}>();

function createEmptyPort(): ToolPort {
  return {
    id: '',
    kind: 'input',
    target: '',
    index: 0,
    name: ''
  }
}

async function create(p: ToolPort) {
  emit('created', p);
  cancel();
}

function cancel() {
  dialog.value = false;
  port.value = createEmptyPort();
}
</script>
