<template>
  <g :transform="`translate(${x} ${y})`">
    <text>{{ value }}</text>
  </g>
</template>

<script lang="ts">
import { useContext } from 'unctx/index';
import Mod from '~~/lib/wrappers/Mod';

export default {
  props: {
    mod: { type: Mod, required: true },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    gain: { type: String, required: true },
    target: { type: String, required: true },
  },
  data() {
    return {
      value: new Array(16).fill(0)
    };
  },
  methods: {
    initValue() {
      const time = useAudioContext().context?.currentTime || 0;
      for (let channel of this.mod.channels) {
        const analyserNode: AnalyserNode = channel.getNode(this.target)?.node as unknown as AnalyserNode;
        const buffer: Float32Array = new Float32Array(1);
        analyserNode.getFloatTimeDomainData(buffer);
        const oldValue = this.value[channel.index];
        const newValue = buffer[0];
        const gain: GainNode = channel.getNode(this.gain)?.node as GainNode;
        if (oldValue !== newValue) {
          console.log("setting at " + newValue)
          gain.gain.cancelScheduledValues(time);
          gain.gain.linearRampToValueAtTime(newValue, time + 1)
        }
        this.value[channel.index] = buffer[0];
      }
    }
  },
  mounted() {
    window.setInterval(() => this.initValue(), 5);
  }
}
</script>