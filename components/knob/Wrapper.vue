<template>
  <g v-if="parameter">
    <knob-label :y="- r - 6" :label="label" />
    <knob-background :radius="r" :editing="control.editing" />
    <knob-gauge :radius="r - 4" :startAngle="30" :endAngle="330" :parameter="parameter" />
    <knob-value :small="r <= 15" :value="value">
      <slot :value="value">{{ value }}</slot>
    </knob-value>
    <circle
      :cx="0"
      :cy="0"
      :r="r"
      fill="transparent"
      @mousedown.stop="onmousedown"
      @wheel.passive.stop="onwheel"
      @click.right.prevent.stop="onrightclick"
      class="drag-starter"
    />
  </g>
</template>

<script setup lang="ts">
import type { Parameter } from '~/types/modules/Parameter';
import { round } from 'lodash';
import type { Control } from '~/types/blueprints/Control';
import type { AudioModule } from '~/types/modules/AudioModule';
import type { DragCallback } from '~/types/draggables/DragDeclaration';
import type { Synthesizer } from '~/types/Index';
import { moveValue, setValue } from '~/utils/functions/parameters';
import { eventbus } from '~/utils/eventbus/EventBus';

const { dragged, dropped, module, r, control } = defineProps({
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
  dropped(() => save(parameter));
}

function onwheel($event: WheelEvent) {
  const ratio = $event.shiftKey ? 10 : 1;
  const sign = - $event.deltaY / Math.abs($event.deltaY);
  moveValue(parameter, sign * parameter.step * ratio);
  debounce('edit-' + parameter.id, 500, () => save(parameter))
}

function onrightclick($event: MouseEvent) {
  useContexts().display($event, {
    items: [
      { label: 'bind', action: useMidiLearn().learn },
      { label: 'unbind', action: useMidiLearn().unlearn },
      { label: 'reset', action: resetValue },
    ],
    payload: parameter,
  })
}

function resetValue(parameter: Parameter) {
  setValue(parameter, parameter.default)
  save(parameter)
}

async function save(parameter: Parameter) {
  parameter.t = Date.now()
  await api_put(`/proxy/parameters/${parameter.id}`, { value: parameter.value, module_id: module.id })
  eventbus.emit(`parameters/update/${module.id}/channel`, { value: parameter.value })
}
</script>