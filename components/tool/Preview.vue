<template>
  <draggable-tool-stage :x="x" :y="y" :scale="scale" :tool=tool>
    <rect :width="modWidth" :height="modHeight" stroke="black" fill="#A3A3A3" />
    <module-screws :slots="tool.slots" />
    <template v-if="!moveMode">
      <g @wheel.capture.stop @click.capture.stop @click.right.capture.stop @mousedown.right.capture.stop @mouseout.capture.stop>
        <g
          v-for="control in tool.controls"
          @mousedown.left.capture.stop="useControlSelection().selectControl(control)"
          @dblclick.capture.stop="useControlEdition().startEdit(control)"
        >
          <controls-wrapper :mod="mod" :control="control" />
        </g>
      </g>
    </template>
  </draggable-tool-stage>
  <v-dialog max-width="500" v-model="useControlEdition().state.value.displayed">
    <v-card>
      <v-card-title>{{ useControlEdition().state.value.creating ? 'creation' : 'edition' }}</v-card-title>
      {{ useControlEdition().state.value.control?.id }}
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import ModulesFactory from '~~/lib/factories/ModulesFactory';
import ITool from '~~/lib/interfaces/ITool';
import IModule from '~~/lib/interfaces/modules/IModule';
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
</script>