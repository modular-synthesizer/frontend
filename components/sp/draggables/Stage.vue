<template>
  <svg class="synple-stage"></svg>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { ScaledCoordinates } from '~/types/utils/Coordinates';

defineOptions({ name: 'synple-stage' });

const { height, target, width } = defineProps({
  height: { type: String, default: '100%' },
  target: { type: Object as PropType<ScaledCoordinates>, required: true },
  width: { type: String, default: '100%', },
})
</script>

<style scoped>
.synple-stage {
  background-color: cadetblue;
  height: v-bind('height');
  width: v-bind('width');
}
</style>