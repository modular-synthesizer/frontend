<template>
  <tool-menu :tool="tool" @mode-changed="changeMode" />

  <div class="global-wrapper">
    <tool-structure v-if="mode === 'infos'" :tool="tool" />
    <tool-structure v-else-if="mode === 'structure'" :tool="tool" />
    <tool-appearance v-else :tool="tool" />
  </div>
</template>

<script setup lang="ts">
import ITool from '~~/lib/interfaces/ITool';
import { ToolTabs } from '~~/lib/types/ToolTabs';

const tool = defineProps({
  tool: { type: Object as PropType<ITool>, required: true },
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