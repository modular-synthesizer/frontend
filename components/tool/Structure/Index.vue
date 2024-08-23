<template>
  <div class="super-wrapper">
    <svg>
      <tool-structure-background @move="seeMove" @start="selectItem(null, '', tool)" />
      <g :transform="`translate(${x} ${y})`">
        <tool-structure-link-list :tool="tool" />
        <tool-structure-node-list :tool="tool" @edit-port="editPort" />
      </g>
    </svg>
    <tool-structure-menu :tool="tool" />
    <tool-structure-dialogs-port
      v-if="p !== null"
      :port="p"
      :tool="tool"
      v-model="dialog"
      @cancelled="dialog = false"
      @validated="validateEditPort"
    />
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash';
import ITool, { IToolPort } from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
});

const x: Ref<number> = ref(100);
const y: Ref<number> = ref(100);

function seeMove(cx: number, cy: number) {
  x.value = cx; y.value = cy;
}

const p: Ref<IToolPort|null> = ref(null);
const dialog: Ref<boolean> = ref(false);

function editPort(port: IToolPort) {
  p.value = cloneDeep(port)
  dialog.value = true;
}

async function validateEditPort(port: IToolPort) {
  await updateElement('ports', tool, port)
  p.value = null;
  dialog.value = false;
}

declareDeletionHandlers(window, onBeforeUnmount);
</script>

<style>
.super-wrapper {
  border: 1px solid white;
  height: calc(100vh - 64px);
}

.super-wrapper > header {
  border: 1px solid white;
  border-bottom: none;
}

svg {
  height: 100%;
  width: 100%;
}
</style>