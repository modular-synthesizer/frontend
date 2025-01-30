<template>
  <v-btn-group divided class="position-absolute menu-btn-group" color="deep-purple darken-2" rounded="pill">
    <sp-button-with-tooltip label="common.back" icon="chevron-left" to="/synthesizers" />
    <module-creator :tools="tools" :synthesizer="synthesizer" @selected="(m: AudioModule) => emit('inserted', m)" />
    <sp-button-with-tooltip @click="useLinksDisplay().toggle()" :icon="linksIcon" :label="`synthesizers.cables.${cablesLabel}`" />
    <sp-button-with-tooltip label="synthesizers.center" icon="compass-outline" @click="reset(synthesizer)" />
  </v-btn-group>
</template>

<script lang="ts" setup>
import type { Tool } from '~~/types/tools/Tool';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import { reset } from '~/utils/functions/synthesizers';

const { tools, synthesizer } = defineProps({
  tools: { type: Array<Tool>, default: () => [] },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});

type EmitType = {
  inserted: [ AudioModule ]
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