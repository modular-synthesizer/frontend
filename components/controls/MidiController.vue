<template>
  <g></g>
</template>

<script lang="ts">
import { eventbus } from '~~/lib/utils/eventbus/EventBus';
import { POLYPHONY_CHANNELS } from '~~/lib/utils/constants';
import type { Channel } from '~/types/modules/Channel';
import type { AudioModule } from '~/types/modules/AudioModule';

export default {
  props: {
    pitch: { type: String, required: true},
    envelope: { type: String, required: true},
    modwheel: { type: String, required: true },
    mod: { type: Object as PropType<AudioModule>, required: true }
  },
  data: function() {
    return {
      inputs: [] as MIDIInput[],
      keysCount: 0,
      midichannel: -1,
    }
  },
  created() {
    const midichannel: number = this.mod.parameters.channel.value ?? -1;
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
      const c = this.mod.channels[channel]
      if (c === undefined) return;
      const gate: ConstantSourceNode = c.nodes[this.envelope] as ConstantSourceNode
      gate.offset.setValueAtTime(1, this.ctx.currentTime);
      this.noteChange({ note, channel })
    },
    noteChange({ note, channel }: any) {
      const voltage: number = (note - 69) / 12;
      const c = this.mod.channels[channel]
      if (!c) return;
      const pitch: ConstantSourceNode = c.nodes[this.pitch] as ConstantSourceNode
      pitch.offset.cancelScheduledValues(this.ctx.currentTime);
      pitch.offset.setValueAtTime(voltage, this.ctx.currentTime);
    },
    noteRelease({ channel }: any) {
      const c = this.mod.channels[channel]
      if (c === undefined) return;
      const gate: ConstantSourceNode = c.nodes[this.envelope] as ConstantSourceNode
      gate.offset.cancelScheduledValues(this.ctx.currentTime);
      gate.offset.setValueAtTime(0, this.ctx.currentTime);
    },
    modWheel({ amount }: any) {
      this.mod.channels.forEach((channel: Channel) => {
        const modnode: ConstantSourceNode = channel.nodes[this.modwheel] as ConstantSourceNode;
        modnode.offset.setValueAtTime(amount, this.ctx.currentTime);
      });
    },
    removeKeyEvents() {
      eventbus.unsubscribe(`midi/trigger/${this.midichannel}`, this.noteTrigger);
      eventbus.unsubscribe(`midi/note-change/${this.midichannel}`, this.noteChange);
      eventbus.unsubscribe(`midi/release/${this.midichannel}`, this.noteRelease);
      eventbus.unsubscribe(`midi/modwheel/${this.midichannel}`, this.modWheel);
      for (let i = 0; i < POLYPHONY_CHANNELS; ++i) {
        const c = this.mod.channels[i]
        if (c === undefined) continue;
        const gate: ConstantSourceNode = c.nodes[this.envelope] as ConstantSourceNode;
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
      return useAudio().context;
    },
  }
}
</script>