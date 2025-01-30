<template>
  <defs>
    <path :id="module.id" :d="`M 0 0 H ${module.width} V ${module.height} H 0 V 0`" />
    <clipPath :id="`clip-${module.id}`">
      <use :xlink:href="`#${module.id}`" />
    </clipPath>
  </defs>
  <g @click.right.prevent.stop="showContext">
    <rect :clip-path="`url(#clip-${module.id})`" :x="0" :y="0" :height="module.height" :width="module.width" class="stroke-shades-black fill-grey" stroke-width="2" />
    <slot></slot>
  </g>
</template>

<script setup lang="ts">
import type { AudioModule } from '~/types/modules/AudioModule';

const { module } = defineProps({
  module: { type: Object as PropType<AudioModule>, required: true }
});

const emit = defineEmits<{ deleted: [ AudioModule ], disconnected: [ AudioModule ] }>();

function showContext($event: MouseEvent) {
  useContexts().display($event, {
    items: [
      { label: 'remove', action: () => emit('deleted', module) },
      { label: 'disconnect', action: () => emit('disconnected', module) },
    ],
    payload: module
  })
}
</script>