<template>
  <draggable-stage :position="position">
    <rect :width="modWidth" :height="modHeight" stroke="black" fill="#A3A3A3" />
    <module-screws :slots="tool.slots" />
    <template v-for="control in tool.controls">
      <ControlsWrapper :mod="mod" :control="control" />
    </template>
    <rect :width="modWidth" :height="modHeight" fill="transparent" />
  </draggable-stage>
</template>

<script lang="ts">import { PropType } from 'vue';
import ModulesFactory from '~~/lib/factories/ModulesFactory';
import ITool from '~~/lib/interfaces/ITool';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import { FakeModule } from '~~/lib/wrappers/FakeModule';
import Knob from "../controls/Knob.vue";
import SmallKnob from "../controls/SmallKnob.vue";
import LargeKnob from "../controls/LargeKnob.vue";
import MuteButton from "../controls/MuteButton.vue";
import Port from "../controls/Port.vue";
import { ScalablePosition } from '~~/lib/types/ScalablePosition';

export default {
  components: { Knob, LargeKnob, MuteButton, SmallKnob, Port },
  props: {
    modelValue: {
      type: Object as PropType<ITool>,
      required: true
    },
  },
  data() {
    return {
      mod: new FakeModule(ModulesFactory.empty()),
      position: { x: 100, y: 50, scale: 1.5 } as ScalablePosition
    }
  },
  computed: {
    tool() { return this.modelValue; },
    modHeight() { return RACK_HEIGHT; },
    modWidth() { return SLOT_SIZE * this.tool.slots; },
  }
}
</script>

<style scoped>
svg {
  height: calc(100vh - 140px);
  width: 100%;
}
</style>