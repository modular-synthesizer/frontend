<template>
  <svg class="layer-wrapper">
    <g class="layer-scale" :transform="scale(targetRef)">
      <g class="layer-translate" :transform="translate(targetRef)" :id="name">
        <slot></slot>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { ScaledCoordinates } from '~/types/utils/Coordinates';
import { scale, translate } from '~/utils/functions/svg';
import { type LayerProps } from './utils';

const { name } = defineProps<LayerProps>();

const targetRef = inject('target') as Ref<ScaledCoordinates>;

provide('mode', 'svg')
</script>

<style scoped>
.layer-wrapper {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>