<template>
  <g></g>
</template>

<script lang="ts">
import Mod from '~~/lib/wrappers/Mod';
import { onKeyDown, onKeyUp } from '@/composables/useMidi';

export default {
  props: {
    pitch: { type: String, required: true},
    tune: { type: String, required: true},
    mod: { type: Mod, required: true }
  },
  data: () =>({
    inputs: [] as MIDIInput[],
  }),
  mounted() {
    onKeyDown((note: number) => {
      console.log("key down", this.mod.id, note);
    });
  },
  computed: {
    pitchSource(): ConstantSourceNode {
      return this.mod.node(this.pitch)?.node as ConstantSourceNode;
    },
    tuneValue(): number {
      return Math.round(this.mod.param(this.tune).value);
    }
  }
}
</script>