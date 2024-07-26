<template>
  <g :transform="`translate(${coords.x} ${coords.y})`" @click="emit('select', node)">
    <rect :height="getNodeHeight(node, tool)" width="180" fill="black" stroke="white" />
    <text x="10" y="20" fill="white">{{ node.name }}</text>
    <g  v-for="(param, i) in parametersFor(node, tool)" :transform="`translate(10, ${(i + 1) * 60 - 20})`">
      <tool-structure-param :param="param" />
    </g>
    <circle v-for="idx in maxIndexTo(node, tool)" cx="0" :cy="20 * idx" r="5" fill="white" />
    <circle v-for="idx in maxIndexFrom(node, tool)" cx="180" :cy="20 * idx" r="5" fill="white" />
  </g>
</template>

<script setup lang="ts">
import { api } from '~~/lib/api/Api';
import { PropType } from 'vue';
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';
import ICoordinates from '~~/lib/interfaces/ICoordinates';

const props = defineProps({
  node: { type: Object as PropType<InnerNode>, required: true },
  selected: { type: Boolean, default: false},
  tool: { type: Object as PropType<ITool>, required: true }
})

const coords: Ref<ICoordinates> = ref({ x: props.node.x, y: props.node.y })

const emit = defineEmits<{
  select: [item: InnerNode],
  moveSelected: [x: number, y: number]
}>();

function nearestCoord(val: number) {
  const div = Math.round(val / 20);
  return div * 20;
}

const timer: Ref<number> = ref(-1);

window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (!props.selected) return;
  window.clearTimeout(timer.value);
  switch(event.code) {
    case 'ArrowRight':
      coords.value.x = nearestCoord(coords.value.x + 20)
      break;
    case 'ArrowLeft':
      coords.value.x = nearestCoord(coords.value.x - 20)
      break;
    case 'ArrowDown':
      coords.value.y = nearestCoord(coords.value.y + 20)
      break;
    case 'ArrowUp':
      coords.value.y = nearestCoord(coords.value.y - 20)
      break;
  }
  emit('moveSelected', coords.value.x, coords.value.y);
  timer.value = window.setTimeout(async () => {
    await api.auth_put(`/tools/nodes/${props.node.id}`, {
      ...props.node,
      tool_id: useRoute().params.id
  });
  }, 200);
});
</script>