<template>
  <draggable-tool-stage :x="x" :y="y" :scale="scale" :tool=tool>
    <rect :width="modWidth" :height="modHeight" stroke="black" fill="#A3A3A3" />
    <module-screws :slots="tool.slots" />
    <template v-if="!moveMode">
      <g @wheel.capture.stop  @mousedown.right.capture.stop @mouseout.capture.stop>
        <g
          v-for="control in tool.controls"
          @click.right.capture.stop.prevent="showMenu(control, $event)"
          @mousedown.left.capture.stop="useControlSelection().selectControl(control, $event)"
        >
          <controls-wrapper :mod="mod" :control="control" />
        </g>
      </g>
    </template>
  </draggable-tool-stage>
  <control-edition-dialog @save="setControl" />
</template>

<script setup lang="ts">
import { findIndex } from 'lodash';
import { PropType } from 'vue';
import ModulesFactory from '~~/lib/factories/ModulesFactory';
import { IControl } from '~~/lib/interfaces/IControl';
import ITool from '~~/lib/interfaces/ITool';
import IModule from '~~/lib/interfaces/modules/IModule';
import { repositories } from '~~/lib/repositories';
import { ScalablePosition } from '~~/lib/types/ScalablePosition';
import { RACK_HEIGHT, SLOT_SIZE } from '~~/lib/utils/constants';
import { FakeModule } from '~~/lib/wrappers/FakeModule';

const props = defineProps({
  modelValue: { type: Object as PropType<ITool>, required: true },
});

const tool: ComputedRef<ITool> = computed(() => props.modelValue);

const mod: IModule = new FakeModule({ ...ModulesFactory.empty(), channels: [] });
const { x, y, scale }: ScalablePosition = { x: 50, y: 50, scale: 1.5 } as ScalablePosition;
const moveMode: Ref<boolean> = ref(false);

const modHeight: number = RACK_HEIGHT;
const modWidth: number = SLOT_SIZE * tool.value.slots;

async function setControl(control: IControl) {
  console.log(control)
  if (control.id === '') await createControl(control);
  else await editControl(control);
}

async function createControl(control: IControl) {
  tool.value.controls.push(await repositories.tool.controls.create(tool.value, control));
}

async function editControl(control: IControl) {
  const index: number = findIndex(props.modelValue.controls, { id: control.id });
  if (index <= -1 ) return;
  props.modelValue.controls[index] = control; 
  await repositories.tool.controls.update(tool.value, tool.value.controls, control);
}

function showMenu(control: IControl, $event: MouseEvent) {
  useContexts().display($event, {
    items: [
      {
        label: 'controls.edit',
        action: useControlEdition().startEdit
      },
      {
        label: 'controls.delete',
        action: async (control: IControl) => {
          await repositories.tool.controls.remove(tool.value, tool.value.controls, control);
        }
      }
    ],
    payload: control,
  });
}
</script>