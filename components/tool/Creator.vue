<template>
  <tool-menu :tool="props.tool" @mode-changed="changeMode" />

  <div class="global-wrapper">
    <tool-structure v-if="mode === 'infos'" :tool="props.tool" />
    <tool-structure v-else-if="mode === 'structure'" :tool="props.tool" />
    <tool-appearance v-else :tool="props.tool" :creation-mode="creationMode" />
  </div>
</template>

<script setup lang="ts">
import ITool from '~~/lib/interfaces/ITool';
import { ToolTabs } from '~~/lib/types/ToolTabs';

const props = defineProps({
  tool: { type: Object as PropType<ITool>, required: true },
  creationMode: { type: Boolean, default: false },
});

const mode: Ref<ToolTabs> = ref('infos');

function changeMode(m: ToolTabs) {
  mode.value = m;
}
</script>

<style scoped>
.global-wrapper {
  height: 100vh;
  overflow: hidden;
  padding-top: 48px;
  width: 100%;
}
</style>