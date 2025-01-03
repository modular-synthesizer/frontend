<template>
  <sp-stage-draggable
    stage="tool-structure"
    :name="`${node.id}`"
    :target="node"
    :sx="10"
    :sy="10"
    @dragend="ondragend"
    @dragmove="ondragmove"
  >
    <g @click.prevent.stop.right="openMenu($event)">
      <rect :height="getNodeHeight(node, tool)" width="180" fill="black" stroke="white" />
      <text x="10" y="20" fill="white">{{ node.name }}</text>
      <g v-for="(param, i) in parametersFor(node, tool)" :transform="`translate(10, ${(i * PARAM_HEIGHT) + TITLE_HEIGHT})`">
        <tool-structure-param :param="param" :tool="tool" :node="node" />
      </g>
      <circle v-for="idx in maxIndexTo(node, tool)" cx="0" :cy="20 * idx" :r="PORT_RADIUS" fill="white" />
      <circle v-for="idx in maxIndexFrom(node, tool)" cx="180" :cy="20 * idx" :r="PORT_RADIUS" fill="white" />
    </g>
  </sp-stage-draggable>
</template>

<script setup lang="ts">
import type { Tool } from '~~/types/tools/Tool';
import type { InnerNode } from '~~/types/tools/InnerNode';
import type { Coordinates } from '~/types/utils/Coordinates';

const { node, tool } = defineProps({
  node: { type: Object as PropType<InnerNode>, required: true },
  tool: { type: Object as PropType<Tool>, required: true }
})

const emit = defineEmits<{
  moved: [item: InnerNode, c: Coordinates ],
  moving: [item: InnerNode, c: Coordinates ]
}>();

function openMenu($event: MouseEvent) {
  useContexts().display($event, {
    items: [
      {
        label: 'Supprimer', action() {
          useSelectables().state.value.nodes.delete(tool);
        }
      }
    ]
  })
}

function ondragend(c: Coordinates) {
  emit('moved', node, c)
}

function ondragmove(c: Coordinates) {
  emit('moving', node, c)
}
</script>

<style scoped>
.selected-stroke {
  pointer-events: none;
}
</style>