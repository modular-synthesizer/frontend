<template>
  <g @click="$emit('select', $props.port)" v-if="$props.tool" :transform="`translate(${c().x} ${c().y})`">
    <circle r="10" :fill="fill()" stroke="white" stroke-width="2" />
    <circle r="10" fill="transparent" stroke="red" stroke-width="4" v-if="selected" />
  </g>
</template>

<script setup lang="ts">
import ICoordinates from '~~/lib/interfaces/ICoordinates';
import IPort from '~~/lib/interfaces/IPort';
import ITool, { InnerNode, IToolPort } from '~~/lib/interfaces/ITool';

const props = defineProps({
  port: { type: Object as PropType<IPort>, required: true },
  tool: { type: Object as PropType<ITool>, required: true },
  selected: { type: Boolean, default: false }
});

const emit = defineEmits<{ select: [ item: IToolPort ]}>()

function target(): InnerNode {
  return props.tool.nodes.find((n: InnerNode) => n.name === props.port.target) as InnerNode;
}

function c(): ICoordinates {
  if ( props.port.kind === 'input' ) {
    return { x: target().x - 20, y: target().y + 20 };
  }
  else {
    return { x: target().x + 200, y: target().y + 20 };
  }
}

function fill(): string {
  return props.port.kind === 'input' ? 'green' : 'blue';
}
</script>