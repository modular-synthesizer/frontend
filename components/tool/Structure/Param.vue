<template>
  <rect y="0" x="10" height="20" width="150" stroke="white" />
  <circle cx="10" cy="10" :r="PORT_RADIUS" fill="white" />
  <text y="15" x="20" fill="white">{{ props.param }}</text>
  <g v-if="getToolParameters().length > 0" transform="translate(150 10)">
    <circle cx="0" cy="0" r="7" fill="red" stroke="white" stroke-width="2" class="circle-cursor" @click.stop.prevent="showParameters" />
  </g>
  <g v-if="shown" transform="translate(170 0)">
    <rect x="0" y="0" :width="getRectWidth() + 20" :height="getToolParameters().length * 30" fill="silver" />
    <template v-for="p in getToolParameters()">
      <text x="10" y="20" ref="texts">{{ p.name }} :: {{ p.field }} ({{ p.minimum }} - {{ p.maximum }} &plusmn; {{ p.step }} p{{ p.precision }})</text>
      <text class="close" :x="getRectWidth()" y="24" @click.prevent.stop="removeParameter(p)">&times;</text>
    </template>
  </g>
</template>

<script setup lang="ts">
import { max, remove } from 'lodash';
import type { Tool } from '~~/types/tools/Tool';
import type { InnerNode } from '~~/types/tools/InnerNode';
import type { ToolParameter } from '~~/types/tools/Parameter';
import { repositories } from '~~/lib/repositories';

const props = defineProps({
  param: { type: String, required: true },
  tool: { type: Object as PropType<Tool>, required: true },
  node: { type: Object as PropType<InnerNode>, required: true }
})

function getToolParameters(): ToolParameter[] {
  return props.tool.parameters.filter((p: ToolParameter) => {
    return p.field === props.param && p.targets.includes(props.node.name)
  });
}

const texts = ref([]);
const shown: Ref<Boolean> = ref(false);

function showParameters() {
  shown.value = !shown.value
}

async function removeParameter(p: ToolParameter) {
  await repositories.tool.parameters.delete(props.tool, p);
  remove(props.tool.parameters, { id: p.id });
}

function getRectWidth() {
  return max(texts.value.map((r: any) => r.getComputedTextLength())) + 20 || 0;
}
</script>

<style scoped>
.circle-cursor {
  cursor: pointer;
}
.close {
  cursor: pointer;
  font-size: 24px;
}
</style>