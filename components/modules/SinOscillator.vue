<template>
  <Port :port="mod.outputs[0]" :dx="4" :dy="35" label="OUT" />
  <Knob :dx="4" :dy="10" :param="mod.param('frequency')" />
</template>

<script lang="ts">import { PropType } from 'vue';
import Mod from '~~/lib/wrappers/Mod';
import Port from "../controls/Port.vue"
import Knob from "../controls/Knob.vue"

export default {
  name: "SinOscillator",
  components: { Knob, Port },
  props: {
    mod: {
      type: Object as PropType<Mod>,
      required: true
    }
  }
}
</script>