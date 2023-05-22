<template>
  <g></g>
</template>

<script lang="ts">
import Mod from '~~/lib/wrappers/Mod';
import Envelope from '~~/lib/signal/envelope';
import KeyMapper from '~~/lib/interfaces/KeyMapper';
import Parameter from '~~/lib/wrappers/Parameter';
import { eventbus } from '~~/lib/utils/eventbus/EventBus';

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
    const midichannel: number = this.mod.parameters.find((p: Parameter) => p.name === 'channel')?.value ?? -1;
    this.declareKeyEvents(midichannel);
    eventbus.subscribe(`parameters/update/${this.mod.id}/channel`, ({ value }: any) =>{
      console.log(value);
    });
  },
  methods: {
    declareKeyEvents(midichannel: number) {
      eventbus.subscribe(`midi/trigger/${midichannel}`, ({ note, mapper }: any) => {
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
      eventbus.subscribe(`midi/release/${midichannel}`, ({ note, mapper }: any) => {
        const channel = this.mod.channels[mapper.channel];
        if (channel === undefined) return;
        const gate: ConstantSourceNode = channel.getNode(this.envelope)?.node as ConstantSourceNode
        gate.offset.setValueAtTime(0, this.ctx.currentTime);
        channel.used = false;
        mapper.channel = -1
      });
    }
  },
  computed: {
    ctx(): AudioContext {
      return useAudioContext().context as AudioContext;
    },
  }
}
</script>