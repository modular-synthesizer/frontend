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
import { eventbus } from '~/utils/eventbus/EventBus';
import { editParameter, editParameterDebounced, previewParameterAdapter } from '~/features/synthesizers/shell/legacy/parameter.adapter';
import type { ParameterChange } from '~/features/synthesizers/core/data/Parameter.type';

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

const label: string = `${control.payload.label ?? ''}`;

const original: Ref<number> = ref(0);

const originalY: Ref<number> = ref(0)

function emitValue(p: Parameter, m: AudioModule) {
  eventbus.emit(`parameters/update/${m.id}/channel`, { value: p.value })
}

function onmousedown($event: MouseEvent) {
  original.value = parameter.value;
  originalY.value = $event.clientY;
  let pixels = 0

  dragged(($event: MouseEvent) => {
    pixels = originalY.value - $event.clientY
    previewParameterAdapter(parameter, { kind: "drag", pixels }, original.value)
  });
  dropped(async () => {
    await editParameter(parameter, { kind: "drag", pixels }, original.value)
    emitValue(parameter, module)
  });
}

async function onwheel($event: WheelEvent) {
  await editParameterDebounced(parameter, { kind: "wheel", deltaY: $event.deltaY, shift: $event.shiftKey })
  emitValue(parameter, module)
}

function onrightclick($event: MouseEvent) {
  useContexts().display($event, {
    items: [
      { label: 'bind', action: useMidiLearn().learn },
      { label: 'unbind', action: useMidiLearn().unlearn },
      {
        label: 'reset', action: async () => {
          await editParameter(parameter, { kind: "reset" })
          emitValue(parameter, module)
        }
      },
    ],
    payload: parameter,
  })
}
</script>
