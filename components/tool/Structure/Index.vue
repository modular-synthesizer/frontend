<template>
  <!--svg @wheel="handleZoom" @mousemove="onmousemove" @mouseup.capture.prevent.stop="useDraggables().reset('tool-structure')"-->
  <sp-stage name="tool-structure">
    <!--g :transform="`translate(${x % BG_SIZE} ${y % BG_SIZE})`">
      <tool-structure-background @move="seeMove" @start="useSelectables().reset()" :scale="scale" />
    </g-->
    <g :transform="`translate(${x} ${y})`">
      <tool-structure-node-list :tool="tool" @edit-port="editPort" />
      <tool-structure-link-list :tool="tool" />
      <tool-structure-port-list :ports="tool.ports" :tool="tool" @edit="editPort" />
    </g>
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
import { useDraggables } from '~/composables/draggables/useDraggables';

const { tool } = defineProps({
  tool: { type: Object as PropType<Tool>, required: true }
});

const x: Ref<number> = ref(0);
const y: Ref<number> = ref(0);
const scale: Ref<number> = ref(1)

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

useDraggables().declare('tool-structure', { x: 0, y: 0 }, { x: 0, y: 48 });

useKeyboardEvents().keydown('Delete', () => {
  useSelectables().delete(tool);
})
</script>

<style scoped>
.super-wrapper > header {
  border: 1px solid white;
  border-bottom: none;
}

svg {
  height: calc(100vh - 48px);
  width: 100%;
}
</style>