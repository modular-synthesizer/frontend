<template>
  <rect y="0" x="0" height="60" width="160" stroke="white" />
  <g :transform="`translate(0 30)`">
    <path d="M -7 -7 L 7 0 L -7 7" fill="white" />
  </g>
  <text y="30" x="10" fill="white">{{ props.param }}</text>
</template>

<script setup lang="ts">
import ITool from '~~/lib/interfaces/ITool';

const props = defineProps({
  param: { type: String, required: true },
  tool: { type: Object as PropType<ITool>, required: true }
})

function getToolParameters() {
  console.log(props.tool.parameters)
}
</script>