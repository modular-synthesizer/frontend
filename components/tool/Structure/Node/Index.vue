<template>
  <sp-stage-draggable
    stage="tool-structure"
    :name="`${node.id}`"
    :target="node"
    :sx="10"
    :sy="10"
    @dragend="ondragend"
  >
    <g @click.prevent.stop.right="openMenu($event)" @click.stop="emit('select', node)">
      <rect :height="getNodeHeight(node, tool)" width="180" fill="black" stroke="white" />
      <text x="10" y="20" fill="white">{{ node.name }}</text>
      <g v-for="(param, i) in parametersFor(node, tool)" :transform="`translate(10, ${(i * PARAM_HEIGHT) + TITLE_HEIGHT})`">
        <tool-structure-param :param="param" :tool="tool" :node="node" />
      </g>
      <rect
        :height="getNodeHeight(node, tool)"
        width="180"
        fill="transparent"
        stroke="red"
        stroke-width="5"
        v-if="selected"
        class="selected-stroke"
      />
      <circle v-for="idx in maxIndexTo(node, tool)" cx="0" :cy="20 * idx" :r="PORT_RADIUS" fill="white" />
      <circle v-for="idx in maxIndexFrom(node, tool)" cx="180" :cy="20 * idx" :r="PORT_RADIUS" fill="white" />
    </g>
  </sp-stage-draggable>
</template>

<script setup lang="ts">
import type { Tool } from '~~/types/tools/Tool';
import type { InnerNode } from '~~/types/tools/InnerNode';
import { repositories } from '~/lib/repositories';

const { node, selected, tool } = defineProps({
  node: { type: Object as PropType<InnerNode>, required: true },
  selected: { type: Boolean, default: false},
  tool: { type: Object as PropType<Tool>, required: true }
})

const emit = defineEmits<{ select: [item: InnerNode] }>();

function openMenu($event: MouseEvent) {
  emit('select', node);
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

function ondragend() {
  repositories.tool.nodes.update(tool, tool.nodes, node);
}
</script>

<style scoped>
.selected-stroke {
  pointer-events: none;
}
</style>