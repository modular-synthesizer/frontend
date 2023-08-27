<template>
  <g></g>
</template>

<script lang="ts">
import Mod from '~~/lib/wrappers/Mod';
import Envelope from '~~/lib/signal/envelope';
import Parameter from '~~/lib/wrappers/Parameter';
import { eventbus } from '~~/lib/utils/eventbus/EventBus';
import { POLYPHONY_CHANNELS } from '~~/lib/utils/constants';
import Channel from '~~/lib/wrappers/Channel';

export default {
  props: {
    pitch: { type: String, required: true},
    envelope: { type: String, required: true},
    modwheel: { type: String, required: true },
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
    eventbus.subscribe('synthesizers/quit', () => {
      this.removeKeyEvents();
    })
  },
  methods: {
    noteTrigger({ note, channel }: any) {
      const c = this.mod.channel(channel);
      if (c === undefined) return;
      const gate: ConstantSourceNode = c.getNode(this.envelope)?.node as ConstantSourceNode
      gate.offset.setValueAtTime(1, this.ctx.currentTime);
      this.noteChange({ note, channel })
    },
    noteChange({ note, channel }: any) {
      const voltage: number = (note - 69) / 12;
      const c = this.mod.channel(channel);
      if (!c) return;
      const pitch: ConstantSourceNode = c.getNode(this.pitch)?.node as ConstantSourceNode
      pitch.offset.cancelScheduledValues(this.ctx.currentTime);
      pitch.offset.setValueAtTime(voltage, this.ctx.currentTime);
    },
    noteRelease({ channel }: any) {
      const c = this.mod.channel(channel);
      if (c === undefined) return;
      const gate: ConstantSourceNode = c.getNode(this.envelope)?.node as ConstantSourceNode
      gate.offset.cancelScheduledValues(this.ctx.currentTime);
      gate.offset.setValueAtTime(0, this.ctx.currentTime);
    },
    modWheel({ amount }: any) {
      this.mod.channels.forEach((channel: Channel) => {
        const modnode: ConstantSourceNode = channel.getNode(this.modwheel)?.node as ConstantSourceNode;
        modnode.offset.setValueAtTime(amount, this.ctx.currentTime);
      });
    },
    removeKeyEvents() {
      eventbus.unsubscribe(`midi/trigger/${this.midichannel}`, this.noteTrigger);
      eventbus.unsubscribe(`midi/note-change/${this.midichannel}`, this.noteChange);
      eventbus.unsubscribe(`midi/release/${this.midichannel}`, this.noteRelease);
      eventbus.unsubscribe(`midi/modwheel/${this.midichannel}`, this.modWheel);
      for (let i = 0; i < POLYPHONY_CHANNELS; ++i) {
        const c = this.mod.channel(i);
        if (c === undefined) continue;
        const gate: ConstantSourceNode = c.getNode(this.envelope)?.node as ConstantSourceNode;
        if (gate === undefined) continue;
        gate.offset.setValueAtTime(0, this.ctx.currentTime);
      }
    },
    declareKeyEvents(midichannel: number) {
      eventbus.subscribe(`midi/trigger/${midichannel}`, this.noteTrigger);
      eventbus.subscribe(`midi/note-change/${midichannel}`, this.noteChange);
      eventbus.subscribe(`midi/release/${midichannel}`, this.noteRelease);
      eventbus.subscribe(`midi/modwheel/${midichannel}`, this.modWheel);
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