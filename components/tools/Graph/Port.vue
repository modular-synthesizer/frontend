<template>
  <g :transform="`translate(${dx ?? 0} ${(position - 1) * 25 + 15})`">
    <circle r="10" stroke="silver" fill="white" />
  </g>
</template>

<script setup lang="ts">
const { position, dx } = defineProps<{position: number, dx: number}>();
</script>