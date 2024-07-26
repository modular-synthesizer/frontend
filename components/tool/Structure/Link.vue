<template>
  <template v-if="hasNodeEnd(link)">
    <path :d="path()" fill="transparent" stroke="white" stroke-width="2" />
  </template>
  <template v-else>
    <path :d="paramPath()" fill="transparent" stroke="white" stroke-width="2" />
  </template>
</template>

<script setup lang="ts">
import ICoordinates from '~~/lib/interfaces/ICoordinates';
import ITool, { InnerLink } from '~~/lib/interfaces/ITool';

const props = defineProps({
  link: { type: Object as PropType<InnerLink>, required: true },
  tool: { type: Object as PropType<ITool>, required: true }
});

function hasNodeEnd(link: InnerLink): boolean {
  return !link.to.node.includes('.');
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

function pathFrom(s: ICoordinates, e: ICoordinates) {
  if (s.x > e.x) {
    const m: ICoordinates = { x: (s.x + e.x) / 2, y: (s.y + e.y) / 2 };
    //return `M ${s.x} ${s.y} L ${m.x} ${m.y}`
    return `M ${s.x} ${s.y} C ${s.x + 100} ${s.y} ${m.x + 100} ${m.y} ${m.x} ${m.y} C ${m.x - 100} ${m.y} ${e.x - 100} ${e.y} ${e.x} ${e.y}`
  }
  return `M ${s.x} ${s.y} C ${s.x + 100} ${s.y} ${e.x - 100} ${e.y} ${e.x} ${e.y}`
}
</script>
