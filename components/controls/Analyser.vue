<template>
  <g :transform="`translate(20 40)`">
    <rect x="0" y="0" width="128" height="200" fill="black" />
    <path :d="path" stroke="white" />
  </g>
</template>

<script lang="ts">
import { times } from 'lodash';
import { mapState } from 'pinia';
import InnerAudioNode from '~~/lib/wrappers/InnerAudioNode';
import Mod from '~~/lib/wrappers/Mod';

export default {
  props: {
    mod: { type: Mod, required: true },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    analyser: { type: String, required: true },
  },
  computed: {
    ...mapState(useSynthesizerDetails, ['synthesizer']),
  },
  methods: {
    buildPath(): string {
      let result = 'M 0 ' + this.buffer[0] / 1.28;
      const canvaSize = 128;
      times(canvaSize, (index: number) => {
        const trueIndex = Math.round(index * (canvaSize / 128));
        result += ` L ${trueIndex} ${this.buffer[trueIndex] / 1.28}`
      })
      return result;
    }
  },
  data() {
    return {
      buffer: new Uint8Array(1),
      path: 'M 0 100 L 128 100',
      bufferSize: 1,
    }
  },
  mounted() {
    if (!this.mod.channels) return;
    const n: InnerAudioNode = this.mod.channels[0].getNode(this.analyser) as InnerAudioNode;
    const analyserNode: AnalyserNode = n.node as AnalyserNode;
    analyserNode.fftSize = 2048
    this.bufferSize = analyserNode.frequencyBinCount;
    this.buffer = new Uint8Array(this.bufferSize);
    window.setInterval(() => {
      (n.node as AnalyserNode).getByteTimeDomainData(this.buffer);
      this.path = this.buildPath();
    }, 100)
  }
}
</script>