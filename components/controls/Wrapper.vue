<template>
  <component :is="'Controls' + control.component" :mod="mod" v-bind="control.payload"/>
</template>

<script lang="ts">
import {
  ControlsKnob,
  ControlsLargeKnob,
  ControlsMidiController,
  ControlsMuteButton,
  ControlsPort,
  ControlsSmallKnob,
  ControlsEnvelopeTrigger
} from "#components"

import { IControl } from "~~/lib/interfaces/IControl";
import Mod from "~~/lib/wrappers/Mod";

export default {
  components: {
    ControlsKnob,
    ControlsLargeKnob,
    ControlsMidiController,
    ControlsMuteButton,
    ControlsPort,
    ControlsSmallKnob,
    ControlsEnvelopeTrigger,
  },
  props: {
    control: {
      type: Object as PropType<IControl>,
      required: true,
    },
    mod: {
      type: Object as PropType<Mod>,
      required: true,
    }
  }
}
</script>