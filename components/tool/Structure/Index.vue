<template>
  <svg>
    <tool-structure-background @move="seeMove" />
    <rect :x="120 + x" :y="120 + y" width="30" height="30" fill="white" />

    
    <rect x="0" y="0" width="50" height="20"></rect>
    <text x="5" y="20" fill="white">{{ x }} ; {{ y }}</text>
  </svg>
</template>

<script setup lang="ts">
const x: Ref<number> = ref(0);
const y: Ref<number> = ref(0);
function seeMove(cx: number, cy: number) {
  x.value = cx; y.value = cy;
}
</script>

<style>
svg {
  border: 1px solid white;
  height: calc(100% - 10px);
  width: 100%;
}
</style>