<template>
  <g></g>
</template>

<script lang="ts">
import Mod from '~~/lib/wrappers/Mod';
import { onKeyDown, onKeyUp } from '@/composables/useMidi';
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
    onKeyDown((note: number) => {
      const voltage: number = 2 ** ((note - 69) / 12) - 1
      this.pitchSource.offset.cancelScheduledValues(this.ctx.currentTime);
      this.pitchSource.offset.setValueAtTime(voltage, this.ctx.currentTime);
      if (this.keysCount === 0) this.env.trigger();
      this.keysCount++;
    });
    onKeyUp((note: number) => {
      this.pitchSource.offset.cancelScheduledValues(this.ctx.currentTime);
      this.pitchSource.offset.setValueAtTime(0, this.ctx.currentTime);
      this.keysCount--;
      if (this.keysCount === 0) this.env.release();
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