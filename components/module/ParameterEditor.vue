<template>
  <v-overlay v-model="store.overlay" />
</template>

<script lang="ts" setup>
const store = useKnobEdition()
</script>

<style scoped>
.editor-wrapper {
  position: absolute;
  top: var(--top);
  left: var(--left);
  width: 400px;
  height: 400px;
}
</style>