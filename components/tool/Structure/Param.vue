<template>
  <rect y="0" x="0" height="60" width="160" stroke="white" />
  <circle cx="0" cy="30" r="5" fill="white" />
  <text y="30" x="10" fill="white">{{ param }}</text>
</template>
<script setup lang="ts">

const props = defineProps({
  param: { type: String, required: true }
})
</script>