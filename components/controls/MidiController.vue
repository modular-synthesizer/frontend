<template>
  <g></g>
</template>

<script lang="ts">
import Mod from '~~/lib/wrappers/Mod';
import Envelope from '~~/lib/signal/envelope';
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
      envelopes: [] as Envelope[],
      keysCount: 0,
    }
  },
  created() {
    midiManager.onkeydown((note: number, mapper: KeyMapper) => {
      const voltage: number = (note - 69) / 12;
      const channel = this.mod.freeChannel();
      channel.used = true;
      mapper.channel = channel.index;

      const pitch: ConstantSourceNode = channel.getNode(this.pitch)?.node as ConstantSourceNode
      const gate: ConstantSourceNode = channel.getNode(this.envelope)?.node as ConstantSourceNode
      pitch.offset.cancelScheduledValues(this.ctx.currentTime);
      pitch.offset.setValueAtTime(voltage, this.ctx.currentTime);
      gate.offset.setValueAtTime(1, this.ctx.currentTime);
    });
    midiManager.onkeyup((note: number, mapper: KeyMapper) => {
      const channel = this.mod.channels[mapper.channel];
      if (channel === undefined) return;
      const gate: ConstantSourceNode = channel.getNode(this.envelope)?.node as ConstantSourceNode
      gate.offset.setValueAtTime(0, this.ctx.currentTime);
      channel.used = false;
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