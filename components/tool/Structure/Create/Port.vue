<template>
  <v-list-item @click="dialog = true">Port</v-list-item>
  <tool-structure-dialogs-port :port="port" :tool="tool" v-model="dialog" @cancelled="cancel" @validated="create" />
</template>

<script setup lang="ts">
import ITool, { IToolPort } from '~~/lib/interfaces/ITool';

const dialog: Ref<boolean> = ref(false);

const port: Ref<IToolPort> = ref(createEmptyPort());

const props = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
})

const emit = defineEmits<{ created: [ port: IToolPort]}>();

function createEmptyPort(): IToolPort {
  return {
    id: '',
    kind: 'input',
    target: '',
    index: 0,
    name: ''
  }
}

async function create(p: IToolPort) {
  emit('created', p);
  cancel();
}

function cancel() {
  dialog.value = false;
  port.value = createEmptyPort();
}
</script>
