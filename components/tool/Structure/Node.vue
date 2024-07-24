<template>
  <g :transform="`translate(${coords.x} ${coords.y})`" @click="emit('select', node)" @keydown="handleKeyDown">
    <rect height="60" width="60" fill="white" />
  </g>
</template>

<script setup lang="ts">
import { api } from '~~/lib/api/Api';
import { PropType } from 'vue';
import { InnerNode } from '~~/lib/interfaces/ITool';

const props = defineProps({
  node: { type: Object as PropType<InnerNode>, required: true },
  selected: { type: Boolean, default: false}
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

const timer: Ref<Number> = ref(-1);

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