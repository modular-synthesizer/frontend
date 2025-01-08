<template>
  <g v-if="parameter" @mousedown.stop="onmousedown">
    <knob-label :x="x" :y="y - r - 6" :label="label" />
    <knob-background :x="x" :y="y" :radius="r" :editing="control.editing" />
    <knob-gauge :x="x" :y="y" :radius="r - 4" :startAngle="30" :endAngle="330" :parameter="parameter" />
    <knob-value :x="x" :y="y" :small="r <= 15" :value="value">
      <slot :value="value">{{ value }}</slot>
    </knob-value>
  </g>
</template>

<script setup lang="ts">
import type { Parameter } from '~/types/modules/Parameter';
import { round } from 'lodash';
import type { Control } from '~/types/tools/Control';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { DragDeclaration } from '~/types/draggables/DragDeclaration';
import { ParamStrategy } from '~/utils/draggables/ParamStrategy';
import { repositories } from '~/lib/repositories';
import type { Synthesizer } from '~/types/Index';
import sendParamEvent from '~/lib/commands/events/sendParamEvent';

const { click, module, r, control, synthesizer } = defineProps({
  r: { type: Number, default: 20 },
  control: { type: Object as PropType<Control>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
  click: { type: Function as PropType<DragDeclaration>, required: true },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});

const parameter: Parameter = Object.values(module.parameters).find((p: Parameter) => {
  return p.name === control.payload.target
}) as Parameter;

const value = computed(() => round(parameter.value, parameter.precision));

const x: number = +control.payload.x;
const y: number = +control.payload.y;
const label: string = `${control.payload.label ?? ''}`;

function onmousedown($event: MouseEvent) {
  click(new ParamStrategy(control, parameter, save), $event);
}

function save() {
  sendParamEvent('endEdit', parameter, synthesizer)
  repositories.modules.updateParameter(parameter);
}
</script>