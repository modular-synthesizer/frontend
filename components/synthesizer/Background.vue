<template>
  <div class="background" />
</template>

<script setup lang="ts">
import type { ScaledCoordinates } from '~/types/utils/Coordinates';

const target = inject('target') as Ref<ScaledCoordinates>;

const bgPosition = computed(() => {
  const { x, y, scale } = target.value
  return `left ${x * scale}px top ${y * scale}px`
})
const bgSize = computed(() => `${20 * target.value.scale}px ${400 * target.value.scale}px`)
</script>

<style scoped>
.background {
  background-color: cadetblue;
  background-image: url("/images/background.svg");
  background-repeat: repeat;
  background-position: v-bind(bgPosition);
  background-size: v-bind(bgSize);
  position: absolute;
  height: 100vh;
  width: 100vw;
}
</style>