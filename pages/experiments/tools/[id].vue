<template>
  <stage v-if="tool" :target="tool" @zoom="onzoom" @panned="save">
    <template #default="{ props }">
      <stage-draggable v-for="node in tool.nodes" v-bind="props" :target="node" :sx="10" :sy="10" @dropped="saveNode(node)">
        <rect :width="node.width" :height="node.height" fill="black" />
      </stage-draggable>
    </template>
  </stage>
</template>

<script setup lang="ts">
import { repositories } from '~/lib/repositories';
import type { InnerNode } from '~/types/tools/InnerNode';
import type { Tool } from '~/types/tools/Tool';

definePageMeta({ layout: false });

const id: string = useRoute().params.id as string;
const tool: Ref<Tool> = ref(await repositories.tools.get(id));

tool.value.nodes.forEach((n: InnerNode) => {
  n.width = 100;
  n.height = 100;
})

function onzoom(scale: number) {
  tool.value.scale = scale;
}

function save() {
  repositories.tools.update(tool.value);
}

function saveNode(node: InnerNode) {
  // repositories.tool.nodes.update(tool.value, tool.value.nodes, node);
}
</script>