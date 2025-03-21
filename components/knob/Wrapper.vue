<template>
  <g v-if="parameter" @mousedown.stop="onmousedown" @wheel.passive.stop="onwheel">
    <knob-label :y="- r - 6" :label="label" />
    <knob-background :radius="r" :editing="control.editing" />
    <knob-gauge :radius="r - 4" :startAngle="30" :endAngle="330" :parameter="parameter" />
    <knob-value :small="r <= 15" :value="value">
      <slot :value="value">{{ value }}</slot>
    </knob-value>
  </g>
</template>

<script setup lang="ts">
import type { Parameter } from '~/types/modules/Parameter';
import { pick, round } from 'lodash';
import type { Control } from '~/types/tools/Control';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { DragCallback } from '~/types/draggables/DragDeclaration';
import { repositories } from '~/lib/repositories';
import type { Synthesizer } from '~/types/Index';
import { moveValue, setValue } from '~/utils/functions/parameters';

const { dragged, dropped, module, r, control, synthesizer } = defineProps({
  r: { type: Number, default: 20 },
  control: { type: Object as PropType<Control>, required: true },
  module: { type: Object as PropType<AudioModule>, required: true },
  dragged: { type: Function as DragCallback, required: true },
  dropped: { type: Function as DragCallback, required: true },
  synthesizer: { type: Object as PropType<Synthesizer>, required: true },
});

const parameter: Parameter = Object.values(module.parameters).find((p: Parameter) => {
  return p.name === control.payload.target
}) as Parameter;

const value = computed(() => round(parameter.value, parameter.precision));

const x: number = +control.payload.x;
const y: number = +control.payload.y;
const label: string = `${control.payload.label ?? ''}`;

const original: Ref<number> = ref(0);

const originalY: Ref<number> = ref(0)

function onmousedown($event: MouseEvent) {
  original.value = parameter.value;
  originalY.value = $event.clientY;

  dragged(($event: MouseEvent) => {
    const delta = Math.round((originalY.value - $event.clientY) / 10);
    const newValue = original.value + delta * parameter.step;
    setValue(parameter, newValue);
  });
  dropped(save);
}

function onwheel($event: WheelEvent) {
  const ratio = $event.shiftKey ? 10 : 1;
  const sign = - $event.deltaY / Math.abs($event.deltaY);
  moveValue(parameter, sign * parameter.step * ratio);
  debounce('edit-' + parameter.id, 500, save)
}

function save() {
  parameter.t = Date.now()
  repositories.parameters.update(pick(parameter, [ 'id', 'value', 't' ]), useSession().token);
}
</script>