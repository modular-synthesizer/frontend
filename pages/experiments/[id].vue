<template>
  <stage :target="synthesizer" @zoom="onzoom" @panned="onmove">
    <template #draggables :v-slot="{ props }">
      <rect :height="100" :width="100" fill="black" v-bind="props" />
      <rect :x="120" :height="100" :width="100" fill="black" />
    </template>
  </stage>
</template>

<script setup lang="ts">
import { repositories } from '~/lib/repositories';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import type { Coordinates } from '~/types/utils/Coordinates';

definePageMeta({ layout: false })

const id: string = useRoute().params.id as string;
const synthesizer: Ref<Synthesizer> = ref(await repositories.synthesizers.get(id));

function onzoom(scale: number) {
  synthesizer.value.scale = scale;
}

function onmove(coordinates: Coordinates) {
  console.log("Saving the synthesizer here");
}
</script>