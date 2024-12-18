<template>
  <component :is="'Controls' + control.component" :control="control" :mod="mod" v-bind="control.payload"/>
</template>

<script lang="ts">
import {
  ControlsKnob,
  ControlsLargeKnob,
  ControlsMidiController,
  ControlsPort,
  ControlsSmallKnob,
  ControlsFader,
} from "#components"
import type { AudioModule } from "~/types/modules/AudioModule";
import type { Control } from "~/types/tools/Control";

export default {
  components: {
    ControlsKnob,
    ControlsLargeKnob,
    ControlsMidiController,
    ControlsPort,
    ControlsSmallKnob,
    ControlsFader,
  },
  props: {
    control: {
      type: Object as PropType<Control>,
      required: true,
    },
    mod: {
      type: Object as PropType<AudioModule>,
      required: true,
    }
  }
}
</script>