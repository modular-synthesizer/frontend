<script setup lang="ts">
import Link from "~~/lib/wrappers/Link";

const { link } = defineProps({
  link: { type: Link, required: true }
});
</script>

<template>
  <g>
    <Connection
      :start-x="link.from.ax"
      :start-y="link.from.ay"
      :end-x="link.to.ax"
      :end-y="link.to.ay"
      @click="useSynthesizerDetails().removeLink(link.id)"
    />
  </g>
</template>