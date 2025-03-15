<template>
  <g ref="label">
    <rect stroke="white" v-bind="rect" />
    <g :transform="translate(10, 10)">
      <text fill="white" class="label-text">{{ label }}</text>
      <text :y="30" fill="white" class="label-text">{{ label }}</text>
    </g>
  </g>
</template>

<script setup>
import { useTemplateRef } from 'vue';
import { translate } from '~/utils/functions/svg';

const { label } = defineProps({
  label: { type: String, required: true },
});

const labelRef = useTemplateRef('label');

const rect = computed(() => {
  const box = labelRef.value?.getBBox();
  if (box === undefined) return {}
  return {
    width: box.width + 20,
    height: box.height + 20,
    x: box.x - 10,
    y: box.y - 10,
  };
});
</script>