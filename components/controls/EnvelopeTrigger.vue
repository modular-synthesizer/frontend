<template>
  <g></g>
</template>

<script lang="ts">
import Envelope from '~~/lib/signal/envelope';
import Gate from '~~/lib/signal/gate';
import Channel from '~~/lib/wrappers/Channel';
import Mod from '~~/lib/wrappers/Mod';

export default {
  props: {
    mod: { type: Mod, required: true },
    attack: { type: String, required: true },
    decay: { type: String, required: true },
    sustain: { type: String, required: true },
    release: { type: String, required: true },
    target: { type: String, required: true },
    analyser: { type: String, required: true },
  },
  data() {
    return {
      value: new Array(16).fill(0)
    };
  },
  computed: {
    a() {
      return this.param(this.attack).value;
    },
    d() {
      return this.param(this.decay).value;
    },
    s() {
      return this.param(this.sustain).value;
    },
    r() {
      return this.param(this.release).value;
    }
  },
  methods: {
    param(name: string) {
      return this.mod.param(name);
    },
  },
  mounted() {
    this.mod.channels.forEach((channel: Channel) => {
      const gate = new Gate(this.mod, channel, this.analyser);
      const envelope = new Envelope(channel, this.target);

      gate.onTrigger(() => envelope.trigger(this.a, this.d, this.s));
      gate.onRelease(() => envelope.release(this.r));
      gatesManager.add(gate);
    });
  }
}
</script>