<template>
  <Port :port="mod.outputs[0]" :dx="4" :dy="35" label="OUT" />
</template>

<script lang="ts">import { PropType } from 'vue';
import IModule from '~~/lib/interfaces/IModule';
import Port from "../controls/Port.vue"

export default {
  name: "SinOscillator",
  components: { Port },
  props: {
    mod: {
      type: Object as PropType<IModule>,
      required: true
    }
  }
}
</script>