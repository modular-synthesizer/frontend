<template>
  <g :transform="`translate(${node.x} ${node.y})`" @click="emit('select', node)">
    <rect height="60" width="60" fill="white" />
    <rect height="60" width="60" fill="transparent" stroke="red" stroke-width="3" v-if="selected" />
  </g>
</template>

<script setup lang="ts">
import { InnerNode } from '~~/lib/interfaces/ITool';

const { node } = defineProps({
  node: { type: Object as PropType<InnerNode>, required: true },
  selected: { type: Boolean, default: false}
})

const emit = defineEmits<{ select: [item: InnerNode]}>();
</script>