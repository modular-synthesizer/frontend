<template>
  <rect y="0" x="10" height="20" width="150" stroke="white" />
  <g :transform="`translate(10 10)`">
    <path d="M -7 -7 L 7 0 L -7 7" fill="white" />
  </g>
  <text y="15" x="20" fill="white">{{ props.param }}</text>
  <g v-if="getToolParameters().length > 0" transform="translate(150 10)">
    <circle cx="0" cy="0" r="7" fill="red" stroke="white" stroke-width="2" class="circle-cursor" @click.stop.prevent="showParameters" />
  </g>
  <g v-if="shown" transform="translate(170 0)">
    <rect x="0" y="0" :width="getRectWidth() + 20" :height="getToolParameters().length * 30" fill="silver" />
    <template v-for="p in getToolParameters()">
      <text x="10" y="20" ref="texts">{{ p.name }} :: {{ p.field }} ({{ p.minimum }} - {{ p.maximum }} &plusmn; {{ p.step }} p{{ p.precision }})</text>
    </template>
  </g>
</template>

<script setup lang="ts">
import { max } from 'lodash';
import ITool, { InnerNode, IToolParameter } from '~~/lib/interfaces/ITool';

const props = defineProps({
  param: { type: String, required: true },
  tool: { type: Object as PropType<ITool>, required: true },
  node: { type: Object as PropType<InnerNode>, required: true }
})

function getToolParameters(): IToolParameter[] {
  return props.tool.parameters.filter((p: IToolParameter) => {
    return p.field === props.param && p.targets.includes(props.node.name)
  });
}

const texts = ref([]);
const shown: Ref<Boolean> = ref(false);

function showParameters() {
  shown.value = !shown.value
}

function getRectWidth() {
  return max(texts.value.map((r: any) => r.getComputedTextLength())) || 0;
}
</script>

<style scoped>
.circle-cursor {
  cursor: pointer;
}
</style>