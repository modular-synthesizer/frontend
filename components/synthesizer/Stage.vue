<template>
  <sp-stage name="synthesizer" :target="synthesizer" @zoomed="saveScale" @dragend="saveCoords">
    <template #background="{ position, scale }">
      <synthesizer-background :position="{ ...position, scale }" />
    </template>
    <synthesizer-module v-for="mod in modules" :mod="mod" :hovered="hovered !== null && equals(hovered, mod)" :synthesizer="synthesizer" />
    <synthesizer-link v-for="link in links" :link="link" />
    <LinkCreator />
  </sp-stage>
</template>

<script lang="ts" setup>
import type { Cable } from '~/types/Cable';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import type { Coordinates } from '~/types/utils/Coordinates';
import { equals } from '~/utils/functions/equals';
import { repositories } from '~~/lib/repositories';

const { synthesizer, modules, links, } = defineProps({
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
  modules: { type: Array<AudioModule>, default: () => [] },
  links: { type: Array<Cable>, default: () => [] }
});

const hovered = computed(() => useHover().state.value.current);

function saveScale(scale: number) {
  synthesizer.scale = scale;
  debounce('save-synthesizer', 500, save);
}

function saveCoords(coordinates: Coordinates) {
  synthesizer.x = coordinates.x;
  synthesizer.y = coordinates.y;
  debounce('save-synthesizer', 500, save);
}

function save() {
  repository.update(synthesizer);
}

const repository = repositories.synthesizers;

onMounted(startManagers)
onUnmounted(stopManagers);
</script>