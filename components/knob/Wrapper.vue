<template>
  <knob-events v-if="parameter" :parameter="parameter" :control=control>
    <knob-label :x="x" :y="y - r - 6" :label="label" />
    <knob-background :x="x" :y="y" :radius="r" :editing="control.editing" />
    <knob-gauge :x="x" :y="y" :radius="r - 4" :startAngle="30" :endAngle="330" :parameter="parameter" />
    <knob-value :x="x" :y="y" :small="small" :value="value">
      <slot :value="value">{{ value }}</slot>
    </knob-value>
  </knob-events>
</template>

<script setup lang="ts">
import type { Parameter } from '~/types/modules/Parameter';
import { round } from 'lodash';
import type { Control } from '~/types/tools/Control';

const { x, y, parameter, r, label, control } = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  parameter: { type: Object as PropType<Parameter>, required: true },
  r: { type: Number, default: 20 },
  label: { type: String, default: "" },
  control: { type: Object as PropType<Control>, required: true },
  small: { type: Boolean, default: false },
});

const value = computed(() => {
  return round(parameter.value, parameter.precision);
});
</script>