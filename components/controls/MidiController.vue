<template>
  <g></g>
</template>

<script lang="ts">
import Mod from '~~/lib/wrappers/Mod';
import Envelope from '~~/lib/signal/envelope';
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
      midichannel: -1,
    }
  },
  created() {
    const midichannel: number = this.mod.parameters.find((p: Parameter) => p.name === 'channel')?.value ?? -1;
    this.declareKeyEvents(midichannel);
    eventbus.subscribe(`parameters/update/${this.mod.id}/channel`, ({ value }: any) => {
      this.removeKeyEvents();
      this.declareKeyEvents(value);
    });
  },
  methods: {
    noteTrigger({ note, channel }: any) {
      const voltage: number = (note - 69) / 12;
      const c = this.mod.channel(channel);

      const pitch: ConstantSourceNode = c.getNode(this.pitch)?.node as ConstantSourceNode
      const gate: ConstantSourceNode = c.getNode(this.envelope)?.node as ConstantSourceNode
      pitch.offset.cancelScheduledValues(this.ctx.currentTime);
      pitch.offset.setValueAtTime(voltage, this.ctx.currentTime);
      gate.offset.setValueAtTime(1, this.ctx.currentTime);
    },
    noteRelease({ channel }: any) {
      const c = this.mod.channel(channel);
      const gate: ConstantSourceNode = c.getNode(this.envelope)?.node as ConstantSourceNode
      gate.offset.setValueAtTime(0, this.ctx.currentTime);
    },
    removeKeyEvents() {
      eventbus.unsubscribe(`midi/trigger/${this.midichannel}`, this.noteTrigger);
      eventbus.unsubscribe(`midi/release/${this.midichannel}`, this.noteRelease);
    },
    declareKeyEvents(midichannel: number) {
      eventbus.subscribe(`midi/trigger/${midichannel}`, this.noteTrigger);
      eventbus.subscribe(`midi/release/${midichannel}`, this.noteRelease);
      this.midichannel = midichannel;
    }
  },
  computed: {
    ctx(): AudioContext {
      return useAudioContext().context as AudioContext;
    },
  }
}
</script>