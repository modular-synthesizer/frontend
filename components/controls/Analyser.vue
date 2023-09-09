<template>
  <g :transform="`translate(20 20)`">
    <rect class="margin" x="0" y="0" :width="width" height="10" fill="black" />
    <rect class="margin" x="0" :y="height + 10" :width="width" height="10" fill="black" />

    <g transform="translate(0 10)">
      <rect x="0" y="0" :width="width" :height="height" fill="black" />
      <line v-for="l in lines" x1="0" :x2="width" :y1="l.y" :y2="l.y" stroke="grey" />
      <line v-for="i in (indexesNeeded - 1)" :x1="i * pixelsPerArray" :y1="0" :x2="i * pixelsPerArray" :y2="height" stroke="grey" />
      <path :d="path" stroke="white" fill="transparent" stroke-width="2" />
    </g>

    <rect x="0" y="0" :width="width" :height="height + 20" fill="transparent" stroke="white" />

    <text x="5" y="8" class="info">{{ indexesNeeded }} | {{ paths.length }} | ppa : {{ pixelsPerArray }}</text>
  </g>
</template>

<script lang="ts">
import { times } from 'lodash';
import { mapState } from 'pinia';
import Mod from '~~/lib/wrappers/Mod';

const WIDTH = 140;
const HEIGHT = 150;
// The sample rate, number of samples made per second
const SAMPLE_RATE = 44100;
// The number of milliseconds between two graphical updates of the oscilloscope.
const INTERVAL = 100;

export default {
  props: {
    mod: { type: Mod, required: true },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    analyser: { type: String, required: true },
  },
  computed: {
    ...mapState(useSynthesizerDetails, ['synthesizer']),
    width(): number { return WIDTH },
    height(): number { return HEIGHT },
    time() { return this.mod.param("time").value; },
    // The number of values to display vertically.
    vps(): number { return 2 * this.mod.param("voltsperscreen").value },
    // Pixels per line
    ppl() {
      return HEIGHT / this.vps;;
    },
    lines() {
      return times(this.vps + 1, (value: number) => {
        return {value, y: value * this.ppl}
      })
    },
    neededFrames(): number {
      return SAMPLE_RATE / 1000 * this.time
    },
    framesperUpdate(): number {
      return SAMPLE_RATE / 1000 * INTERVAL;
    },
    indexesNeeded(): number {
      return Math.ceil(this.neededFrames / this.framesperUpdate)
    },
    node(): AnalyserNode {
      return this.mod.channels[0].getNode(this.analyser)?.node as AnalyserNode;
    },
    pixelsPerArray(): number {
      return WIDTH / this.indexesNeeded;
    }
  },
  methods: {
    yVal(value: number): number {
      const signed: number = value - 127;
      return HEIGHT / 2 - (signed / 128 * this.ppl);
    },
    // Main function triggered every interval of time to draw the path.
    handleInterval() {
      this.index++;
      if (this.index >= this.indexesNeeded) this.index = 0;
      this.node.getByteTimeDomainData(this.buffer);
      this.appendPath();
    },
    appendPath(): void { 

      let result = '';
      console.log("Executing the append " + this.buffer.length + " times")
      times(this.pixelsPerArray, (value: number) => {
        const x = (value / this.bufferSize + this.index) * this.pixelsPerArray;
        const y = this.yVal(this.buffer[value]);

        result += ` L ${x} ${y}`;
      });
      this.paths[this.index] = result
      this.path = `M 0 100 ${this.paths.join()}`;
    },
    /**
     * This initializes the buffer with a size of 8192 samples. This means that at each interval, 8192 frames will be
     * analyzed and put in the buffer, corresponding, at a 44100Hz sample rate, to 0.185 seconds of data from the
     * audio input. That is why the interval is set to 180ms to not lose too much of data each interval.
     */
    initializeBuffer(): void {
      let fftsize: number = 2
      do { fftsize = fftsize * 2 } while (fftsize < 2 * this.framesperUpdate);
      this.node.fftSize = fftsize;
      this.bufferSize = this.node.frequencyBinCount;
      this.buffer = new Uint8Array(this.bufferSize);
    }
  },
  data() {
    return {
      interval: -1,
      buffer: new Uint8Array(1),
      // The array storing all the paths as an array of strings
      paths: [] as string[],
      path: 'M 0 100 L 128 100',
      bufferSize: 1,
      index: 0,
    }
  },
  unmounted() {
    window.clearInterval(this.interval)
  },
  mounted() {
    if (!this.mod.channels) return;

    // These lines mean that at each interval, 8192 frames are taken to be put in the buffer
    this.initializeBuffer();

    this.interval = window.setInterval(this.handleInterval, INTERVAL)
  }
}
</script>

<style scoped>
.info {
  fill: white;
  font-size: 9px;
}
</style>