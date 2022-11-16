<template>
  <Port :port="mod.inputs[0]" :dx="2" :dy="5" label="IN" />
  <Port :port="mod.outputs[0]" :dx="2" :dy="35" label="OUT" />
</template>

<script lang="ts">import { PropType } from 'vue';
import Mod from '~~/lib/wrappers/Mod';
import Port from "../controls/Port.vue"
import Knob from "../controls/Knob.vue"

export default {
  name: "ProgrammableGain",
  components: { Knob, Port },
  props: {
    mod: {
      type: Object as PropType<Mod>,
      required: true
    }
  }
}
</script>