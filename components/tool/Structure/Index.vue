<template>
  <div class="super-wrapper">
    <svg>
      <tool-structure-background @move="seeMove" @start="selectNode(null)" />
      <g :transform="`translate(${x} ${y})`">
        <template v-for="node in tool.nodes">
          <tool-structure-node
            v-if="node.id !== selectedNode?.id"
            :node="node"
            :selected="false"
            @select="selectNode"
            @removed="deleteNode(node)"
            :tool="tool"
          />
        </template>
        <tool-structure-node
          v-if="selectedNode !== null"
          :node="selectedNode"
          :selected="true"
          @moveSelected="moveSelected"
          @removed="deleteNode(selectedNode)"
          :tool="tool"
        />
        <template v-for="link in tool.links">
          <tool-structure-link
            v-if="link.id !== selectedLink?.id"
            :link="link"
            :tool="tool"
            @selected="selectLink"
          />
        </template>
        <tool-structure-link
          v-if="selectedLink !== null"
          :link="selectedLink"
          :tool="tool"
          :selected="true"
          @deselected="selectedLink = null"
        />
        <tool-structure-port v-for="port in tool.ports" :port="port" :tool="tool" />
      </g>
    </svg>
    <tool-structure-menu :tool="tool" />
  </div>
</template>

<script setup lang="ts">
import { remove } from 'lodash';
import { api } from '~~/lib/api/Api';
import ITool, { InnerLink, InnerNode } from '~~/lib/interfaces/ITool';

const { tool } = defineProps({
  tool: { type: Object as PropType<ITool>, required: true }
});

const selectedNode: Ref<InnerNode|null> = ref(null);
const selectedLink: Ref<InnerLink|null> = ref(null);

const x: Ref<number> = ref(100);
const y: Ref<number> = ref(100);

function seeMove(cx: number, cy: number) {
  x.value = cx; y.value = cy;
}

function moveSelected(x: number, y: number) {
  if (selectedNode.value !== null) {
    selectedNode.value.x = x;
    selectedNode.value.y = y
  }
}

function selectNode(node: InnerNode|null) {
  selectedNode.value = null;
  selectedLink.value = null;
  selectedNode.value = node;
}

function selectLink(link: InnerLink) {
  selectedNode.value = null;
  selectedLink.value = link;
}

async function deleteNode(node: InnerNode|null) {
  if (node === null) return;
  remove(tool.nodes, node);
  await api.auth_delete(`/tools/nodes/${node.id}`, { tool_id: tool.id });
}

async function deleteLink(link: InnerLink|null) {
  if (link === null) return;
  selectedLink.value = null;
  remove(tool.links, link);
  await api.auth_delete(`/tools/links/${link.id}`, {tool_id: tool.id })
}

function deleteCurrentSelection(event: KeyboardEvent) {
  if (event.code !== 'Delete') return;
  deleteNode(selectedNode.value)
  deleteLink(selectedLink.value)
}

window.addEventListener('keydown', deleteCurrentSelection)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', deleteCurrentSelection)
})
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