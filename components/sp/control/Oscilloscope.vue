<template>
  <g :transform="`translate(${x} ${y})`">
    <rect :x="0" :y="0" :width="width" :height="200" fill="#003300" />
    <g :transform="`translate(0 100)`" v-for="channel in mod?.channels">
      <controls-oscilloscope-channel :channel="channel" :add-fetcher="addFetcher" :fftsize="length.value" :target="target" />
    </g>
    <rect :x="0" :y="0" :width="width" :height="200" fill="transparent" stroke="black" stroke-width="3" />
  </g>
</template>

<script setup lang="ts">
import type { AudioModule, Control } from "~/types/Index";
import type { Parameter } from "~/types/modules/Parameter";

const { x, y, target, mod } = defineProps({
  target: { type: String, default: '' },
  label: { type: String, default: '' },
  mod: { type: Object as PropType<AudioModule>, required: true },
  control: { type: Object as PropType<Control>, required: true },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
});

const frequency: Ref<Parameter> = ref(mod?.parameters['interval'] as Parameter);

const width: Ref<number> = ref(200);

// The number of frames in the results array
const length: Ref<Parameter> = ref(mod?.parameters['length'] as Parameter);

function getData() {
  callbacks.forEach((c: () => void) => c());
}

const interval: Ref<number> = ref(-1)

interval.value = window.setInterval(getData, frequency.value.value);

watch(frequency.value, (p: Parameter) => {
  window.clearInterval(interval.value);
  interval.value = window.setInterval(getData, p.value);
});

const callbacks: Array<() => void> = []

function addFetcher(callback: () => void) {
  callbacks.push(callback);
}
</script>