<template>
  <g v-if="isValidLink()" @click="handleClick" class="link">
    <circle v-bind="circleCoords()" :r="PORT_RADIUS" :fill="stroke" />
    <template v-if="hasNodeEnd(link)">
      <path :d="path()" fill="transparent" :stroke="stroke" :stroke-width="STROKE_WIDTH" />
      <circle :cx="getEndCoords(link, tool).x" :cy="getEndCoords(link, tool).y" :r="PORT_RADIUS" :fill="stroke" />
    </template>
    <template v-else>
      <path :d="paramPath()" fill="transparent" :stroke="stroke" :stroke-width="STROKE_WIDTH" />
      <circle :cx="getParamCoords(link, tool).x" :cy="getParamCoords(link, tool).y" :r="PORT_RADIUS" :fill="stroke" />
    </template>
  </g>
</template>

<script setup lang="ts">
import { findIndex } from 'lodash';
import type { Tool } from '~~/types/tools/Tool';
import type { InnerLink } from '~~/types/tools/InnerLink';
import type { InnerNode } from '~~/types/tools/InnerNode';
import type { Coordinates } from '~/types/utils/Coordinates';

const STROKE_WIDTH = 4;

const props = defineProps({
  link: { type: Object as PropType<InnerLink>, required: true },
  tool: { type: Object as PropType<Tool>, required: true },
  selected: { type: Boolean, default: false }
});

const stroke = computed(() => props.selected ? 'red' : 'white')

const emit = defineEmits<{ selected: [link: InnerLink], deselected: [] }>();

function hasNodeEnd(link: InnerLink): boolean {
  return !link.to.node.includes('.');
}

function circleCoords() {
  const coords: Coordinates = getStartCoords(props.link, props.tool);
  return { cx: coords.x, cy: coords.y }
}

function isValidLink(): boolean {
  return findIndex(props.tool.nodes, (n: InnerNode) => n.name === props.link.to.node.split('.')[0]) >= 0;
}

function path() {
  return pathFrom(
    getStartCoords(props.link, props.tool),
    getEndCoords(props.link, props.tool)
  );
}

function paramPath() {
  return pathFrom(
    getStartCoords(props.link, props.tool),
    getParamCoords(props.link, props.tool)
  );
}

function handleClick() {
  props.selected ? emit('deselected') : emit('selected', props.link);
}

function pathFrom(s: Coordinates, e: Coordinates) {
  if (s.x > e.x) {
    const m: Coordinates = { x: (s.x + e.x) / 2, y: (s.y + e.y) / 2 };
    //return `M ${s.x} ${s.y} L ${m.x} ${m.y}`
    return `M ${s.x} ${s.y} C ${s.x + 100} ${s.y} ${m.x + 100} ${m.y} ${m.x} ${m.y} C ${m.x - 100} ${m.y} ${e.x - 100} ${e.y} ${e.x} ${e.y}`
  }
  const d: number = e.x - s.x
  return `M ${s.x} ${s.y} C ${s.x + d} ${s.y} ${e.x - d} ${e.y} ${e.x} ${e.y}`
}
</script>

<style scoped>
.link { cursor: pointer; }
</style>