<template>
  <g
    v-if="parameter !== undefined"
    @mousedown.left.stop="onMouseDown"
    @wheel.passive="onWheel"
    @click.right.stop.prevent="onRightClick(parameter, $event)"
  >
    <slot></slot>
  </g>
</template>

<script setup lang="ts">
import sendParamEvent from '~~/lib/commands/events/sendParamEvent';
import type { Parameter } from '~/types/modules/Parameter';
import { moveValue } from '~/utils/functions/parameters';
import type { Control } from '~/types/tools/Control';

const { control, parameter } = defineProps({
  parameter: { type: Object as PropType<Parameter>, required: true },
  control: { type: Object as PropType<Control>, required: true },
});


function onRightClick(parameter: Parameter, $event: MouseEvent) {
  useContexts().display($event, {
    items: [
      {label: 'bind', action: useMidiLearn().learn},
      {label: 'unbind', action: useMidiLearn().unlearn}
    ],
    payload: parameter,
  })
}

function onMouseDown($event: MouseEvent) {
  if (control.editing) return;
  control.editing = true;
  startParameterSetting(
    { control, $event, parameter, mode: Strategies.DECORRELATED },
    () => (control.editing = false)
  );
}

const timeout: Ref<number> = ref(-1);

function fireWheelEvent({ deltaY }: WheelEvent) {
  if (timeout.value !== -1) window.clearTimeout(timeout.value);

  sendParamEvent('startEdit', parameter);

  timeout.value = window.setTimeout(() => {
    saveParameter(parameter);
    sendParamEvent('endEdit', parameter);
    timeout.value = -1;
  }, 500);

  const ratio = useKeyboard().shift ? 10 : 1;

  const sign = - deltaY / Math.abs(deltaY)
  moveValue(parameter, sign * parameter.step * ratio);
}

function onWheel($event: WheelEvent): void {
  if (control.editing) return;
  $event.stopPropagation();
  fireWheelEvent($event)
}
</script>