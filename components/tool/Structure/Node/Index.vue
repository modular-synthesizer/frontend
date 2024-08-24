<template>
  <g :transform="`translate(${$props.node.x} ${$props.node.y})`" @click="emit('select', node)">
    <rect :height="getNodeHeight(node, tool)" width="180" fill="black" stroke="white" />
    <text x="10" y="20" fill="white">{{ node.name }}</text>
    <g  v-for="(param, i) in parametersFor(node, tool)" :transform="`translate(10, ${(i * PARAM_HEIGHT) + TITLE_HEIGHT})`">
      <tool-structure-param :param="param" :tool="tool" :node="node" />
    </g>
    <rect
      :height="getNodeHeight(node, tool)"
      width="180"
      fill="transparent"
      stroke="red"
      stroke-width="5"
      v-if="$props.selected"
      class="selected-stroke"
    />
    <circle v-for="idx in maxIndexTo(node, tool)" cx="0" :cy="20 * idx" r="5" fill="white" />
    <circle v-for="idx in maxIndexFrom(node, tool)" cx="180" :cy="20 * idx" r="5" fill="white" />
  </g>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import ITool, { InnerNode, IToolPort } from '~~/lib/interfaces/ITool';

const props = defineProps({
  node: { type: Object as PropType<InnerNode>, required: true },
  selected: { type: Boolean, default: false},
  tool: { type: Object as PropType<ITool>, required: true }
})

const emit = defineEmits<{
  select: [item: InnerNode],
  moveSelected: [x: number, y: number],
  editPort: [ item: IToolPort ]
}>();
</script>

<style scoped>
.close {
  font-size: 24px;
  cursor: pointer;
}
.selected-stroke {
  pointer-events: none;
}
</style>