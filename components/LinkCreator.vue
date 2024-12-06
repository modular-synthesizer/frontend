<template>
  <g v-if="state && state.display">
    <Connection
      :start-x="state.start?.x"
      :start-y="state.start?.y"
      :end-x="state.end?.x"
      :end-y="state.end?.y"
      :color="color"
      :no-events="true"
    />
  </g>
</template>

<script lang="ts" setup>
const state = reactive(linkCreationState);
const color = ref('red')
</script>

<style scoped>
.link-dot, .link-line {
  pointer-events: none;
}
</style>