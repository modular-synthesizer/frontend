<template>
  <svg class="nodes-graph">
    <g v-for="n in nodes" :transform="`translate(${100 + n.x} ${100 + n.y})`">
      <rect :x="0" :y="0" width="200" height="50" fill="#555555" />
      <text x="10" y="15" dominant-baseline="middle" fill="white">{{ n.name }}</text>
      <text x="10" y="35" dominant-baseline="middle">{{ n.generator }}</text>
    </g>
  </svg>
</template>

<script lang="ts">
import { InnerNode } from '~~/lib/interfaces/ITool';

export default {
  props: {
    nodes: {
      type: Array<InnerNode>,
      default: () => []
    }
  }
}
</script>

<style scoped>
.nodes-graph {
  width: 100%;
  height: 500px;
  background-color: black;
}
</style>