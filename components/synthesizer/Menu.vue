<template>
  <v-btn-group divided class="position-absolute menu-btn-group" color="deep-purple darken-2" rounded="pill">
    <sp-button-with-tooltip label="common.back" icon="chevron-left" to="/synthesizers" />
    <module-creator :tools="tools" :synthesizer="synthesizer" @selected="(m: Mod) => emit('inserted', m)" />
    <sp-button-with-tooltip @click="useLinksDisplay().toggle()" :icon="linksIcon" :label="`synthesizers.cables.${cablesLabel}`" />
    <sp-button-with-tooltip label="synthesizers.center" icon="compass-outline" @click="useSynthesizer().resetReference()" />
  </v-btn-group>
</template>

<script lang="ts" setup>
import ITool from '~~/lib/interfaces/ITool';
import Mod from '~~/lib/wrappers/Mod';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

const { tools, synthesizer } = defineProps({
  tools: { type: Array<ITool>, default: () => [] },
  synthesizer: { type: Synthesizer, required: true },
});

type EmitType = {
  inserted: [ Mod ]
}
const emit = defineEmits<EmitType>();

const linksIcon = computed((): string => {
  return useLinksDisplay().displayed.value ? 'eye-outline' : 'eye-off-outline'
});

const cablesLabel = computed((): string => {
  return useLinksDisplay().displayed.value ? 'hide' : 'show';
})
</script>

<style scoped>
.menu-btn-group {
  top: 30px;
  left: 30px;
}
</style>