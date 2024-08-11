<template>
  <g :transform="`translate(${$props.node.x} ${$props.node.y})`" @click="emit('select', node)">
    <rect :height="getNodeHeight(node, tool)" width="180" fill="black" stroke="white" />
    <text x="10" y="20" fill="white">{{ node.name }}</text>
    <g  v-for="(param, i) in parametersFor(node, tool)" :transform="`translate(10, ${(i * PARAM_HEIGHT) + TITLE_HEIGHT})`">
      <tool-structure-param :param="param" />
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
    <g v-for="idx in maxIndexTo(node, tool)" :transform="`translate(0 ${20 * idx})`">
      <path d="M -7 -7 L 7 0 L -7 7" fill="white" />
    </g>
    <circle v-for="idx in maxIndexFrom(node, tool)" cx="180" :cy="20 * idx" r="5" fill="white" />
    <tool-structure-port-list :ports="getPorts()" :tool="tool" @edit="editPort" />
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

function getPorts() {
  return props.tool.ports.filter((p: IToolPort) => p.target === props.node.name)
}

function editPort(port: IToolPort) {
  emit('editPort', port)
}
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