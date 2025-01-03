<template>
  <sp-stage name="tool-structure" :target="tool" :dy="48" @zoomed="updateScale" @dragend="updateCoordinates" :bg-width="BG_SIZE" :bg-height="BG_SIZE" @mousedown="useSelectables().reset()">
    <template #background>
      <tool-structure-background :scale="tool.scale" @mousedown="useSelectables().reset()" />
    </template>
    <tool-structure-node-list :tool="tool" @edit-port="editPort" />
    <tool-structure-link-list :tool="tool" />
    <tool-structure-port-list :ports="tool.ports" :tool="tool" @edit="editPort" />
  </sp-stage>
  <tool-structure-dialogs-port
    v-if="p !== null"
    :port="p"
    :tool="tool"
    v-model="dialog"
    @cancelled="dialog = false"
    @validated="validateEditPort"
  />
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash';
import type { Tool } from '~~/types/tools/Tool';
import type { ToolPort } from '~~/types/tools/Port';
import { repositories } from '~~/lib/repositories';
import type { Coordinates } from '~/types/utils/Coordinates';

const { tool } = defineProps({
  tool: { type: Object as PropType<Tool>, required: true }
});

const p: Ref<ToolPort|null> = ref(null);
const dialog: Ref<boolean> = ref(false);

function editPort(port: ToolPort) {
  p.value = cloneDeep(port)
  dialog.value = true;
}

async function validateEditPort(port: ToolPort) {
  await repositories.tool.ports.update(tool, tool.ports, port);
  p.value = null;
  dialog.value = false;
}

async function updateScale(scale: number) {
  tool.scale = scale;
  repositories.tools.update(tool);
}

async function updateCoordinates(coordinates: Coordinates) {
  tool.x = coordinates.x;
  tool.y = coordinates.y;
  repositories.tools.update(tool);
}

useKeyboardEvents().keydown('Delete', () => useSelectables().delete(tool));
</script>

<style scoped>
svg {
  height: calc(100vh - 48px);
  width: 100%;
}
</style>