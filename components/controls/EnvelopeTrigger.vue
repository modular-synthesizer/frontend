<template>
  <g></g>
</template>

<script lang="ts">
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
    initValue(time: number) {
      for (let channel of this.mod.channels) {
        const analyserNode: AnalyserNode = channel.getNode(this.analyser)?.node as unknown as AnalyserNode;
        const buffer: Float32Array = new Float32Array(1);
        analyserNode.getFloatTimeDomainData(buffer);
        const oldValue = this.value[channel.index];
        const newValue = buffer[0];
        const gain: GainNode = channel.getNode(this.target)?.node as GainNode;
        if (oldValue !== newValue) {
          gain.gain.cancelAndHoldAtTime(time);
          if (newValue === 1) {
            console.log("triggering attack for channel " + channel.index);
            gain.gain.setTargetAtTime(1, time, this.a / 1000)
            gain.gain.setTargetAtTime(this.s / 100, time,  (this.a + this.d) / 1000)
          }
          else {
            console.log("triggering release for channel " + channel.index);
            gain.gain.setTargetAtTime(0, time, this.r / 1000)
          }
        }
        this.value[channel.index] = buffer[0];
      }
    },
    param(name: string) {
      return this.mod.param(name);
    },
  },
  mounted() {
    const ctx: AudioContext|null = useAudioContext().context
    if (ctx === null) return;
    window.setInterval(() => this.initValue(ctx.currentTime));
  }
}
</script>