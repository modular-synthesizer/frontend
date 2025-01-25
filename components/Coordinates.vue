<template>
  <div class="absolute">
    <span>{{ state.x }}</span> ; <span>{{ state.y }}</span>
  </div>
</template>

<script setup lang="ts">
const state = useCoordinates().state;
</script>

<style scoped>
.absolute {
  position: absolute;
  top: 100px;
  left: 30px;
  z-index: 1000;
  background-color: white;
  padding: 5px;
  color: black;
}
</style>