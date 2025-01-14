<template>
  <path stroke="#009900" stroke-width="3" :d="line" />
  <path stroke="white" opacity="0.6" stroke-width="1" :d="line" />
</template>

<script setup lang="ts">
import { clamp } from 'lodash';
import type { Channel } from '~/types/modules/Channel';
import { nextPowerOfTwo } from '~/utils/functions/maths';

type FetcherDeclaration = (callback: () => void) => void;

/**
 * This component represents the wave drawing for one channel of the oscilloscope.
 * The channels are then all overlapped to draw the whole waves when the synth is polyphonic.
 */
const { addFetcher, channel, fftsize, target, width } = defineProps({
  channel: { type: Object as PropType<Channel>, required: true },
  addFetcher: { type: Function as PropType<FetcherDeclaration>, required: true },
  fftsize: { type: Number, default: 32 },
  target: { type: String, required: true },
  width: { type: Number, default: 200 },
});

const samples: Ref<Float32Array> = ref(new Float32Array(fftsize));

const node: Ref<AnalyserNode|undefined> = ref(channel.nodes[target] as (AnalyserNode|undefined));

const line: Ref<string> = ref('');

function callback() {
  if (node.value === undefined) return;
  samples.value = new Float32Array(fftsize);
  
  node.value.fftSize = nextPowerOfTwo(fftsize)
  
  node.value.getFloatTimeDomainData(samples.value);
  line.value = 'M0 ' + samples.value[0] * 100 + ' ';
  for (let i = 1; i <= fftsize; ++i) {
    const v: number = clamp(100 * samples.value[i], -100, 100)
    line.value += 'L' + (i * (width / samples.value.length)) + ' ' + v + ' ';
  }
}

addFetcher(callback);
</script>