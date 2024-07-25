<template>
  <rect y="0" x="0" height="60" width="160" stroke="white" />
  <text y="30" x="10" fill="white">{{ param.name }} :: {{ param.field }}</text>
</template>

<script setup lang="ts">
import { IToolParameter } from '~~/lib/interfaces/ITool';

const props = defineProps({
  param: { type: Object as PropType<IToolParameter>, required: true }
})
</script>