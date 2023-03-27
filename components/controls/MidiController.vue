<template>
  <g></g>
</template>

<script lang="ts">
import Mod from '~~/lib/wrappers/Mod';
import Envelope from '~~/lib/utils/envelope';
import { POLYPHONY_CHANNELS } from '~~/lib/utils/constants';
import KeyMapper from '~~/lib/interfaces/KeyMapper';

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
    for (let channel of this.mod.channels) {
      this.env.bind(channel.getNode(this.envelope)?.node as ConstantSourceNode);
    }
    onKeyDown((note: number, mapper: KeyMapper) => {
      const voltage: number = (note - 69) / 12;
      const channel = this.mod.freeChannel();
      channel.used = true;
      mapper.channel = channel.index;

      this.env.trigger(channel.index);

      const pitch: ConstantSourceNode = channel.getNode(this.pitch)?.node as ConstantSourceNode
      pitch.offset.cancelScheduledValues(this.ctx.currentTime);
      pitch.offset.setValueAtTime(voltage, this.ctx.currentTime);
    });
    onKeyUp((note: number, mapper: KeyMapper) => {
      console.log("PATATE", mapper)
      this.env.release(mapper.channel);
      this.mod.channel(mapper.channel).used = false;
      mapper.channel = -1
    })
  },
  computed: {
    ctx(): AudioContext {
      return useAudioContext().context as AudioContext;
    },
  }
}
</script>