<script setup lang="ts">
import type { Cable } from "~/types/Cable";

const { link } = defineProps({
  link: { type: Object as PropType<Cable>, required: true }
});
</script>

<template>
  <g>
    <Connection
      :start-x="link.from.ax"
      :start-y="link.from.ay"
      :end-x="link.to.ax"
      :end-y="link.to.ay"
      @click="useSynthesizer().removeLink(link)"
      :show-cable="useLinksDisplay().displayed.value"
    />
  </g>
</template>