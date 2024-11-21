<template>
  <draggable-stage :position="position" v-if="tool">
    <rect :width="modWidth" :height="modHeight" stroke="black" fill="#A3A3A3" />
    <module-screws :slots="tool.slots" />
    <template v-for="control in tool.controls">
      <ControlsWrapper :mod="mod" :control="control" />
    </template>
    <rect :width="modWidth" :height="modHeight" fill="transparent" />
  </draggable-stage>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import ModulesFactory from '~~/lib/factories/ModulesFactory';
import ITool from '~~/lib/interfaces/ITool';
import IModule from '~~/lib/interfaces/modules/IModule';
import { ScalablePosition } from '~~/lib/types/ScalablePosition';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import { FakeModule } from '~~/lib/wrappers/FakeModule';
const props = defineProps({
  modelValue: { type: Object as PropType<ITool>, required: true },
});

const tool: ComputedRef<ITool> = computed(() => props.modelValue);

const mod: IModule = new FakeModule({ ...ModulesFactory.empty(), channels: [] });
const position: ScalablePosition = { x: 100, y: 50, scale: 1.5 } as ScalablePosition

const modHeight: number = RACK_HEIGHT;
const modWidth: number = SLOT_SIZE * tool.value.slots;
</script>

<style scoped>
svg {
  height: calc(100vh - 140px);
  width: 100%;
}
</style>