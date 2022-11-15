<template>
  <Port :port="mod.inputs[0]" :dx="3" :dy="4" label="IN" />
</template>

<script lang="ts">import { PropType } from 'vue';
import IModule from '~~/lib/interfaces/IModule';
import Port from "../controls/Port.vue"

export default {
  name: "StandardOutput",
  components: { Port },
  props: {
    mod: {
      type: Object as PropType<IModule>,
      required: true
    }
  }
}
</script>