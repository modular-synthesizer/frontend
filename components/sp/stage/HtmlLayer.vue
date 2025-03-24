<template>
  <div class="layer-wrapper">
    <div class="layer-scale">
      <div class="layer-translate" :id="name">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScaledCoordinates } from '~/types/utils/Coordinates';
import { type LayerProps } from './utils';

const { name } = defineProps<LayerProps>();

const targetRef = inject('target') as Ref<ScaledCoordinates>;

const translate: ComputedRef<string> = computed(() => {
  return `${targetRef.value.x}px ${targetRef.value.y}px`
});

const scale: ComputedRef<string> = computed(() => `${targetRef.value.scale}`)

provide('mode', 'html')
</script>

<style scoped>
.layer-wrapper {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
.layer-scale {
  scale: v-bind(scale);
  transform-origin: top left;
}
.layer-translate {
  translate: v-bind(translate);
}
</style>