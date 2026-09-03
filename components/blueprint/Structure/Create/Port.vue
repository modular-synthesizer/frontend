<template>
    <v-btn :key icon>
      <v-icon>mdi-audio-input-xlr</v-icon>
      <blueprint-structure-dialogs-port :port="port" :blueprint="blueprint" @cancelled="cancel" @validated="create" />
    </v-btn>
</template>

<script setup lang="ts">
import type { Blueprint } from '~~/types/blueprints/Blueprint';
import type { ToolPort } from '~~/types/blueprints/Port';

const dialog: Ref<boolean> = ref(false);

const port: Ref<ToolPort> = ref(createEmptyPort());

const { blueprint } = defineProps({
  blueprint: { type: Object as PropType<Blueprint>, required: true },
  key: { type: Number },
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
