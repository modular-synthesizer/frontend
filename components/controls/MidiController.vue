<template>
  <g></g>
</template>

<script lang="ts">
import Mod from '~~/lib/wrappers/Mod';
import { onKeyDown, onLastKeyUp, onFirstKeyDown } from '@/composables/useMidi';
import Envelope from '~~/lib/utils/envelope';
import Channel from '~~/lib/wrappers/Channel';
import { POLYPHONY_CHANNELS } from '~~/lib/utils/constants';

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
      channelsOccupancy: new Array(POLYPHONY_CHANNELS).fill(false)
    }
  },
  mounted() {
    this.env.bind(this.mod.channels[0].getNode(this.envelope)?.node as ConstantSourceNode);
    onFirstKeyDown((_note: number) => {
      this.env.trigger();
    })
    onKeyDown((note: number) => {
      const voltage: number = (note - 69) / 12;
      const channel = this.mod.freeChannel();
      channel.used = true;

      const pitch: ConstantSourceNode = channel.getNode(this.pitch)?.node as ConstantSourceNode
      pitch.offset.cancelScheduledValues(this.ctx.currentTime);
      pitch.offset.setValueAtTime(voltage, this.ctx.currentTime);
    });
    onLastKeyUp((_note: number) => {
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