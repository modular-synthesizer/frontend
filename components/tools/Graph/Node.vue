<template>
  <rect :x="node.x" :y="node.y" fill="white" width="50" height="50" />
</template>

<script lang="ts" setup>
import InnerAudioNode from '~~/lib/wrappers/InnerAudioNode';
const { node } = defineProps<{node: InnerAudioNode}>();
</script>