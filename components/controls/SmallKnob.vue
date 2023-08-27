<template>
  <GenericKnob :x="x" :y="y" :parameter=mod.param(target) :r="14" :cursor-size="6" :label="label" :control="control" v-slot="{ value }">
    {{ isMidi ? midiLabel(value): value }}
  </GenericKnob>
</template>

<script lang="ts">
import GenericKnob from "~~/components/controls/utils/GenericKnob.vue"
import { IControl } from "~~/lib/interfaces/IControl";
import Mod from "~~/lib/wrappers/Mod";

export default {
  props: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    target: { type: String, required: true },
    label: { type: String, default: "" },
    mod: { type: Mod, required: true },
    control: { type: Object as PropType<IControl>, required: true },
    midi: { type: String, default: 'false' }
  },
  components: { GenericKnob },
  computed: {
    isMidi(): Boolean {
      return this.midi === 'true';
    },
  },
  methods: {
    midiLabel(value: number): String {
      return value === -1 ? 'KBD' : `${value + 1}`;
    },
  }
}
</script>