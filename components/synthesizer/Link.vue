<script setup lang="ts">
import type { Cable } from "~/types/Cable";
import { getAbsoluteCoordinates } from "~/utils/functions/ports";

const { link } = defineProps({
  link: { type: Object as PropType<Cable>, required: true }
});

const start = computed(() => getAbsoluteCoordinates(link.from));
const end = computed(() => getAbsoluteCoordinates(link.to));
</script>

<template>
  <g>
    <Connection
      :start-x="start.x"
      :start-y="start.y"
      :end-x="end.x"
      :end-y="end.y"
      @click="useSynthesizer().removeLink(link)"
      :show-cable="useLinksDisplay().displayed.value"
    />
  </g>
</template>