<template>
  <g></g>
</template>

<script lang="ts">
import Mod from '~~/lib/wrappers/Mod';
import { onKeyDown, onLastKeyUp, onFirstKeyDown } from '@/composables/useMidi';
import Envelope from '~~/lib/utils/envelope';
import Channel from '~~/lib/wrappers/Channel';

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
    this.env.bind(this.mod.channels[0].getNode(this.envelope)?.node as ConstantSourceNode);
    console.log(this.env);
    onFirstKeyDown((_note: number) => {
      console.log("triggering envelope");
      this.env.trigger();
    })
    onKeyDown((note: number) => {
      const voltage: number = (note - 69) / 12;
      const pitch: ConstantSourceNode = this.mod.channels[0].getNode(this.pitch)?.node as ConstantSourceNode
      pitch.offset.cancelScheduledValues(this.ctx.currentTime);
      pitch.offset.setValueAtTime(voltage, this.ctx.currentTime);
    });
    onLastKeyUp((_note: number) => {
      console.log("releasing envelope");
      this.env.release();
    });
  },
  computed: {
    ctx(): AudioContext {
      return useAudioContext().context as AudioContext;
    },
  }
}
</script>