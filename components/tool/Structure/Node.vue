<template>
  <g :transform="`translate(${$props.node.x} ${$props.node.y})`" @click="emit('select', node)">
    <rect :height="getNodeHeight(node, tool)" width="180" fill="black" stroke="white" />
    <text x="10" y="20" fill="white">{{ node.name }}</text>
    <text class="close" x="160" y="22" fill="white" @click.stop="emit('removed')">&times;</text>
    <g  v-for="(param, i) in parametersFor(node, tool)" :transform="`translate(10, ${(i + 1) * 60 - 20})`">
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
  </g>
</template>

<script setup lang="ts">
import { api } from '~~/lib/api/Api';
import { PropType } from 'vue';
import ITool, { InnerNode } from '~~/lib/interfaces/ITool';
import { onBeforeUnmount } from 'vue'

const props = defineProps({
  node: { type: Object as PropType<InnerNode>, required: true },
  selected: { type: Boolean, default: false},
  tool: { type: Object as PropType<ITool>, required: true }
})

const emit = defineEmits<{
  select: [item: InnerNode],
  moveSelected: [x: number, y: number],
  removed: []
}>();

function nearestCoord(val: number) {
  const div = Math.round(val / 20);
  return div * 20;
}

const timer: Ref<number> = ref(-1);

function handleKeyPress (event: KeyboardEvent) {
  if (!props.selected) return;
  console.log(`${props.node.id} is selected`)
  window.clearTimeout(timer.value);
  switch(event.code) {
    case 'ArrowRight':
      props.node.x = nearestCoord(props.node.x + 20)
      break;
    case 'ArrowLeft':
      props.node.x = nearestCoord(props.node.x - 20)
      break;
    case 'ArrowDown':
      props.node.y = nearestCoord(props.node.y + 20)
      break;
    case 'ArrowUp':
      props.node.y = nearestCoord(props.node.y - 20)
      break;
  }
  emit('moveSelected', props.node.x, props.node.y);
  timer.value = window.setTimeout(async () => {
    await api.auth_put(`/tools/nodes/${props.node.id}`, {
      ...props.node,
      tool_id: useRoute().params.id
  });
  }, 200);
}

window.addEventListener('keydown', handleKeyPress);

onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyPress))
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