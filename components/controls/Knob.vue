<template>
  <GenericKnob :mod="mod" :parameter="mod.param(target)" :x="x" :y="y" :label="label" />
</template>

<script lang="ts">
import GenericKnob from "~~/components/controls/utils/GenericKnob.vue"
import Mod from "~~/lib/wrappers/Mod";

export default {
  name: 'Knob',
  props: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    target: { type: String, required: true },
    label: { type: String, default: "" },
    mod: { type: Mod, required: true }
  },
  components: { GenericKnob }
}
</script>