<template>
  <svg @wheel="handleZoom">
    <g :transform="`scale(${scale} ${scale})`">
      <g :transform="`translate(${x % BG_SIZE} ${y % BG_SIZE})`">
        <tool-structure-background @move="seeMove" @start="selectItem(null, '', tool)" :scale="scale" />
      </g>
      <g :transform="`translate(${x} ${y})`">
        <tool-structure-node-list :tool="tool" @edit-port="editPort" />
        <tool-structure-link-list :tool="tool" />
        <tool-structure-port-list :ports="tool.ports" :tool="tool" @edit="editPort" />
      </g>
    </g>
  </svg>
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
import { ZOOM_RATIO, MAX_ZOOM_OUT, MAX_ZOOM_IN } from '~~/lib/utils/constants';
import { cloneDeep } from 'lodash';
import ITool, { IToolPort } from '~~/lib/interfaces/ITool';
import { repositories } from '~~/lib/repositories';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
});

const x: Ref<number> = ref(0);
const y: Ref<number> = ref(0);
const scale: Ref<number> = ref(1)

function seeMove(cx: number, cy: number) {
  x.value = cx / scale.value;
  y.value = cy / scale.value;
}

const p: Ref<IToolPort|null> = ref(null);
const dialog: Ref<boolean> = ref(false);

function editPort(port: IToolPort) {
  p.value = cloneDeep(port)
  dialog.value = true;
}

async function validateEditPort(port: IToolPort) {
  await repositories.tool.ports.update(tool, tool.ports, port);
  p.value = null;
  dialog.value = false;
}

function handleZoom(event: WheelEvent) {
  let s: number = Math.abs(scale.value + event.deltaY * -ZOOM_RATIO);
  scale.value = Math.min(Math.max(MAX_ZOOM_OUT, s), MAX_ZOOM_IN);
}

declareDeletionHandlers(window, onBeforeUnmount);
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