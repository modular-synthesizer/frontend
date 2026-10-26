<template>
  <v-btn-group divided class="position-absolute menu-btn-group" color="deep-purple darken-2" rounded="pill">
    <sp-button-with-tooltip label="common.back" icon="chevron-left" to="/synthesizers" />
    <module-creator :synthesizer="synthesizer" :modules @selected="(m: ModulePayload) => emit('created', m)" />
    <sp-button-with-tooltip @click="useLinksDisplay().toggle()" :icon="linksIcon" :label="`synthesizers.cables.${cablesLabel}`" />
    <sp-button-with-tooltip label="synthesizers.center" icon="compass-outline" @click="emit('recenter')" />
  </v-btn-group>
</template>

<script lang="ts" setup>
import { useLinksDisplay } from '~/composables/links/useLinksDisplay';
import type { AudioModule, ModulePayload } from '~/types/modules/AudioModule';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';

const { synthesizer } = defineProps({
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
  modules: { type: Array<AudioModule>, default: [] }
});

type EmitType = {
  created: [ ModulePayload ],
  recenter: [ ]
}
const emit = defineEmits<EmitType>();

const linksIcon = computed((): string => {
  return useLinksDisplay().displayed ? 'eye-outline' : 'eye-off-outline'
});

const cablesLabel = computed((): string => {
  return useLinksDisplay().displayed ? 'hide' : 'show';
})
</script>

<style scoped>
.menu-btn-group {
  top: 30px;
  left: 30px;
}
</style>