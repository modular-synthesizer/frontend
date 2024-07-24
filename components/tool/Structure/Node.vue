<template>
  <g :transform="`translate(${coords.x} ${coords.y})`" @click="emit('select', node)" @keydown="handleKeyDown">
    <rect height="60" width="60" fill="white" />
    <rect height="60" width="60" fill="transparent" stroke="red" stroke-width="3" v-if="props.selected" />
  </g>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { InnerNode } from '~~/lib/interfaces/ITool';

const props = defineProps({
  node: { type: Object as PropType<InnerNode>, required: true },
  selected: { type: Boolean, default: false}
})

const coords: Ref<ICoordinates> = ref({ x: props.node.x, y: props.node.y })

const emit = defineEmits<{
  select: [item: InnerNode],
}>();

window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (!props.selected) return;
  switch(event.code) {
    case 'ArrowRight':
      coords.value.x += 20
      break;
    case 'ArrowLeft':
      coords.value.x -= 20
      break;
    case 'ArrowDown':
      coords.value.y += 20
      break;
    case 'ArrowUp':
      coords.value.y -= 20
      break;
  }
});
</script>