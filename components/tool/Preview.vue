<template>
  <draggable-tool-stage :x="x" :y="y" :scale="scale" :tool=tool @move="updateInList">
    <rect :width="modWidth" :height="modHeight" stroke="black" fill="#A3A3A3" />
    <module-screws :slots="tool.slots" />
    <template v-if="!moveMode">
      <g
        v-for="control in tool.controls"
        @click.right.capture.stop.prevent="showMenu(control, $event)"
        @mousedown.left.capture.stop="useControlSelection().selectControl(control, $event)"
        @wheel.capture.stop 
        @mousedown.right.capture.stop
        @mouseout.capture.stop
      >
        <controls-wrapper :mod="mod" :control="control" />
      </g>
    </template>
  </draggable-tool-stage>
  <control-edition-dialog @save="setControl" />
</template>

<script setup lang="ts">
import { findIndex } from 'lodash';
import type { Tool } from '~~/types/tools/Tool';
import type { Control } from '~~/types/tools/Control';
import { repositories } from '~~/lib/repositories';
import type { ScalablePosition } from '~~/lib/types/ScalablePosition';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import type { AudioModule } from '~/types/modules/AudioModule';
import { createEmptyModule } from '~/utils/factories/modules';

const props = defineProps({
  modelValue: { type: Object as PropType<Tool>, required: true },
});

const tool: ComputedRef<Tool> = computed(() => props.modelValue);

const mod: AudioModule =  createEmptyModule(tool.value);
const { x, y, scale }: ScalablePosition = { x: 50, y: 50, scale: 1.5 } as ScalablePosition;
const moveMode: Ref<boolean> = ref(false);

const modHeight: number = RACK_HEIGHT;
const modWidth: number = SLOT_SIZE * tool.value.slots;

async function setControl(control: Control) {
  if (control.id === '') await createControl(control);
  else await editControl(control);
}

async function createControl(control: Control) {
  const creation: Control = await repositories.tool.controls.create(tool.value, control);
  tool.value.controls.push(creation);
}

async function editControl(control: Control) {
  const index: number = findIndex(props.modelValue.controls, { id: control.id });
  if (index <= -1 ) return;
  props.modelValue.controls[index] = control;
  await repositories.tool.controls.update(tool.value, tool.value.controls, control);
}

function updateInList(control: Control) {
  const index: number = findIndex(props.modelValue.controls, { id: control.id });
  if (index <= -1 ) return;
  props.modelValue.controls[index] = control
}

function showMenu(control: Control, $event: MouseEvent) {
  useContexts().display($event, {
    items: [
      {
        label: 'controls.edit',
        action: useControlEdition().startEdit
      },
      {
        label: 'controls.delete',
        action: async (control: Control) => {
          await repositories.tool.controls.remove(tool.value, tool.value.controls, control);
        }
      }
    ],
    payload: control,
  });
}
</script>