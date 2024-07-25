<template>
  
</template>

<script setup lang="ts">
import ITool, { InnerLink } from '~~/lib/interfaces/ITool';

const props = defineProps({
  link: { type: Object as PropType<InnerLink>, required: true },
  tool: { type: Object as PropType<ITool>, required: true }
});

getStartCoord(props.link, props.tool)
</script>
