<template>
  <g
    @click.stop.prevent="selectPort"
    @dblclick.stop.prevent="$emit('edit', port)"
    v-if="getNode !== undefined" :transform="`translate(${getNode.x + x()} ${getNode.y + port.index * 20 + 20})`"
  >
    <path :d="path()" :stroke="selected ? 'red' : 'white'" stroke-width="3"/>
    <circle r="8" :fill="fill()" stroke="white" stroke-width="2" />
    <circle r="8" fill="transparent" stroke="red" stroke-width="4" v-if="selected" />
    <template v-if="selected">
      <circle :cx="cx()" :cy="0" :r="PORT_RADIUS" fill="red" />
    </template>
  </g>
</template>

<script setup lang="ts">
import type { Tool } from '~~/types/tools/Tool';
import type { ToolPort } from '~~/types/tools/Port';
import type { InnerNode } from '~~/types/tools/InnerNode';

const props = defineProps({
  port: { type: Object as PropType<ToolPort>, required: true },
  tool: { type: Object as PropType<Tool>, required: true },
  selected: { type: Boolean, default: false },
});

const emit = defineEmits<{ select: [ item: ToolPort ], unselect: [], edit: [ item: ToolPort ]}>();

const OFFSET = 30

function cx() {
  return props.port.kind === 'input' ? OFFSET : - OFFSET;
}

function x(): number {
  return props.port.kind === 'input' ? - OFFSET : 180 + OFFSET;
}

function fill(): string {
  return props.port.kind === 'input' ? 'green' : 'blue';
}

function selectPort() {
  props.selected ? emit('unselect') : emit('select', props.port)
}

function path() {
  return `M 0 0 L ${props.port.kind === 'input' ? OFFSET : -OFFSET} 0`
}

const getNode = computed(() => {
  return props.tool.nodes.find((n: InnerNode) => n.name === props.port.target)
});
</script>