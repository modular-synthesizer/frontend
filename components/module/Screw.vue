<template>
  <circle :cx="x" :cy="y" :r="radius" class="fill-blue-grey-lighten-1 stroke-blue-grey-darken-2 screw-background" />
  <g :transform="`translate(${x - radius} ${y})`">
    <g :transform="`rotate(${angle} ${radius} 0)`">
      <rect x="2" :width="2 * (radius - 2)" y="-1" height="2" class="fill-blue-grey-lighten-4" />
    </g>
  </g>
</template>

<script lang="ts" setup>
  const { x, y } = defineProps<{x: number, y: number}>()
  const angle = Math.round(Math.random() * 36) * 10;
  const radius = 6;
</script>