<template>
  <draggable-blueprint-stage :x="x" :y="y" :scale="scale" :blueprint=blueprint @move="updateInList">
    <rect :width="modWidth" :height="modHeight" stroke="black" fill="#A3A3A3" />
    <module-screws :slots="blueprint.slots" />
    <template v-if="!moveMode">
      <g
        v-for="control in blueprint.controls"
        @click.right.capture.stop.prevent="showMenu(control, $event)"
        @mousedown.left.capture.stop="useControlSelection().selectControl(control, $event)"
        @wheel.capture.stop 
        @mousedown.right.capture.stop
        @mouseout.capture.stop
      >
        <controls-wrapper :mod="mod" :control="control" />
      </g>
    </template>
  </draggable-blueprint-stage>
  <control-edition-dialog @save="setControl" />
</template>

<script setup lang="ts">
import { findIndex } from 'lodash';
import type { Blueprint } from '~~/types/blueprints/Blueprint';
import type { Control } from '~~/types/blueprints/Control';
import { repositories } from '~~/lib/repositories';
import { RACK_HEIGHT, SLOT_SIZE } from '~/utils/constants';
import type { AudioModule } from '~/types/modules/AudioModule';
import { createEmptyModule } from '~/utils/factories/modules';
import type { ScaledCoordinates } from '~/types/utils/Coordinates';

const props = defineProps({
  modelValue: { type: Object as PropType<Blueprint>, required: true },
});

const blueprint: ComputedRef<Blueprint> = computed(() => props.modelValue);

const mod: AudioModule =  createEmptyModule(blueprint.value);
const { x, y, scale }: ScaledCoordinates = { x: 50, y: 50, scale: 1.5 } as ScaledCoordinates;
const moveMode: Ref<boolean> = ref(false);

const modHeight: number = RACK_HEIGHT;
const modWidth: number = SLOT_SIZE * blueprint.value.slots;

async function setControl(control: Control) {
  if (control.id === '') await createControl(control);
  else await editControl(control);
}

async function createControl(control: Control) {
  const creation: Control = await repositories.blueprint.controls.create(blueprint.value, control);
  blueprint.value.controls.push(creation);
}

async function editControl(control: Control) {
  const index: number = findIndex(props.modelValue.controls, { id: control.id });
  if (index <= -1 ) return;
  props.modelValue.controls[index] = control;
  await repositories.blueprint.controls.update(blueprint.value, blueprint.value.controls, control);
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
          await repositories.blueprint.controls.remove(blueprint.value, blueprint.value.controls, control);
        }
      }
    ],
    payload: control,
  });
}
</script>