<template>
  <defs>
    <pattern id="bg" patternUnits="userSpaceOnUse" :width="BG_SIZE" :height="BG_SIZE">
      <rect :x="0" :y="0" :width="DOT_SIZE" :height="DOT_SIZE" fill="white"></rect>
    </pattern>
  </defs>
  <rect :width="`${120 / scale}%`" :height="`${120 / scale}%`" fill="url(#bg)" />
</template>

<script setup lang="ts">
const DOT_SIZE = 2;

const { scale } = defineProps({
  scale: { type: Number, default: 1 },
})
</script>