
import loginVue from '~~/pages/login.vue';
<template>
  <g
    :transform="`translate(${node.x} ${node.y})`"
    @mousedown.prevent.stop="startInnerNodeDrag"
  >
    <rect x="0" y="0" fill="white" width="50" height="50" />
    <text x="3" y="15">{{node.name}}</text>
  </g>
</template>

<script lang="ts" setup>
import InnerAudioNode from '~~/lib/wrappers/InnerAudioNode';
const { node } = defineProps<{node: InnerAudioNode}>();
</script>