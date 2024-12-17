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
import type { Control } from "~/types/tools/Control";

import Mod from "~~/lib/wrappers/Mod";

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
      type: Object as PropType<Mod>,
      required: true,
    }
  }
}
</script>