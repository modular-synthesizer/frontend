<template>
  <g></g>
</template>

<script lang="ts">
import Mod from '~~/lib/wrappers/Mod';

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
    navigator.requestMIDIAccess().then((access: MIDIAccess) => {
      for (let input of access.inputs.values()) {
        input.onmidimessage = (message: MIDIMessage) => {
          if (message.data[0] === 144) {

          }
        }
      }
    })
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