<template>
  <sp-stage :target="referential" @click="useSelectables().reset">
    <sp-stage-svg-layer name="tool">
      <sp-stage-draggable v-for="node in tool.nodes" :target="node" :sx="10" :sy="10">
        <tool-structure-node
          :node="node"
          :selected="false"
          :tool="tool"
        />
      </sp-stage-draggable>
      <tool-structure-link-list :tool="tool" />
      <tool-structure-port-list :ports="tool.ports" :tool="tool" @edit="editPort" />
    </sp-stage-svg-layer>
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
import type { Tool } from '~~/types/tools/Tool';
import type { ToolPort } from '~~/types/tools/Port';
import type { ScaledCoordinates } from '~/types/utils/Coordinates';
import { cloneDeep } from 'lodash';
import { repositories } from '~/lib/repositories';

const { tool } = defineProps({
  tool: { type: Object as PropType<Tool>, required: true }
});

const referential: Ref<ScaledCoordinates> = ref({ x: 0, y: 0, scale: 1 })

const p: Ref<ToolPort|null> = ref(null);
const dialog: Ref<boolean> = ref(false);

function editPort(port: ToolPort) {
  p.value = cloneDeep(port)
  dialog.value = true;
}

async function validateEditPort(port: ToolPort) {
  await repositories.tool.ports.update(tool, port);
  p.value = null;
  dialog.value = false;
}

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