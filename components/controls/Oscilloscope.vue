<template>
  <g :transform="`translate(${x} ${y})`">
    <rect :x="0" :y="0" :width="width" :height="200" fill="#003300" />
    <g :transform="`translate(0 100)`" v-if="channel">
      <path stroke="#009900" stroke-width="3" :d="line" />
      <path stroke="white" opacity="0.6" stroke-width="1" :d="line" />
    </g>
    <rect :x="0" :y="0" :width="width" :height="200" fill="transparent" stroke="black" stroke-width="3" />
  </g>
</template>

<script setup lang="ts">
import { clamp } from "lodash";
import type { Channel } from "~/types/modules/Channel";
import type { Parameter } from "~/types/modules/Parameter";
import { nextPowerOfTwo } from "~/utils/functions/maths";
import { ControlsPayload, KnobPayload } from "~~/lib/types/controls";

const { x, y, target, mod } = defineProps({
  ...KnobPayload, ...ControlsPayload
});

const channel: Channel = mod?.channels[0] as Channel;

const node: AnalyserNode = channel?.nodes[`${target}`] as AnalyserNode;

const frequency: Ref<Parameter> = ref(mod?.parameters['interval'] as Parameter);

// The results array, mutated when an analyser node is read.
const arr: Ref<Float32Array> = ref(new Float32Array(node?.fftSize ?? 2048));

const line: Ref<string> = ref('');

const width: Ref<number> = ref(200);

// The number of frames in the results array
const length: Ref<Parameter> = ref(mod?.parameters['length'] as Parameter);

function getData() {
  arr.value = new Float32Array(length.value.value);
  node.fftSize = nextPowerOfTwo(length.value.value)
  
  node.getFloatTimeDomainData(arr.value);
  line.value = 'M0 ' + arr.value[0] * 100 + ' ';
  for (let i = 1; i <= length.value.value; ++i) {
    const v: number = clamp(100 * arr.value[i], -100, 100)
    line.value += 'L' + (i * (width.value / arr.value.length)) + ' ' + v + ' ';
  }
}

const interval: Ref<number> = ref(-1)

if (channel !== undefined) {
  interval.value = window.setInterval(getData, frequency.value.value);
}

watch(frequency.value, (p: Parameter) => {
  window.clearInterval(interval.value);
  interval.value = window.setInterval(getData, p.value);
});
</script>