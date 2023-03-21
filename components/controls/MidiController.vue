<template>
  <g></g>
</template>

<script lang="ts">
import Mod from '~~/lib/wrappers/Mod';
import { onKeyDown, onLastKeyUp, onFirstKeyDown } from '@/composables/useMidi';
import Envelope from '~~/lib/utils/envelope';

export default {
  props: {
    pitch: { type: String, required: true},
    envelope: { type: String, required: true},
    mod: { type: Mod, required: true }
  },
  data: function() {
    return {
      inputs: [] as MIDIInput[],
      env: new Envelope(),
      keysCount: 0,
    }
  },
  mounted() {
    this.env.bind(this.envelopeSource);
    onFirstKeyDown((_note: number) => {
      this.env.trigger();
    })
    onKeyDown((note: number) => {
      const voltage: number = (note - 69) / 12;
      this.pitchSource.offset.cancelScheduledValues(this.ctx.currentTime);
      this.pitchSource.offset.setValueAtTime(voltage, this.ctx.currentTime);
    });
    onLastKeyUp((_note: number) => {
      this.env.release();
    });
  },
  computed: {
    pitchSource(): ConstantSourceNode {
      return this.mod.node(this.pitch)?.node as ConstantSourceNode;
    },
    envelopeSource(): ConstantSourceNode {
      return this.mod.node(this.envelope)?.node as ConstantSourceNode;
    },
    ctx(): AudioContext {
      return useAudioContext().context as AudioContext;
    },
  }
}
</script>