<template>
  <GenericKnob :parameter="parameter" />
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