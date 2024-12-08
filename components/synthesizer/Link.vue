<script setup lang="ts">
import Link from "~~/lib/wrappers/Link";

const { link } = defineProps({
  link: { type: Link, required: true }
});
</script>

<template>
  <g>
    <Connection
      :start-x="link.origin.ax"
      :start-y="link.origin.ay"
      :end-x="link.destination.ax"
      :end-y="link.destination.ay"
      @click="useSynthesizer().removeLink(link.id)"
      :show-cable="useLinksDisplay().displayed.value"
    />
  </g>
</template>