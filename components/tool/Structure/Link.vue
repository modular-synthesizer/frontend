<template>
  <template v-if="hasNodeEnd(link)">
    <path :d="path()" fill="white" stroke="white" stroke-width="2" />
  </template>
  <template v-else>
    <path :d="paramPath()" fill="white" stroke="white" stroke-width="2" />
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

function pathFrom(from: ICoordinates, to: ICoordinates) {
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`
}
</script>
