<template>
  <GenericKnob :parameter="parameter" :r="14" :cursor-size="6"/>
</template>

<script lang="ts">
import GenericKnob from "~~/components/controls/utils/GenericKnob.vue"
import Parameter from "~~/lib/wrappers/Parameter";

export default {
  props: {
    parameter: {
      type: Parameter,
      required: true
    },
  },
  components: { GenericKnob }
}
</script>