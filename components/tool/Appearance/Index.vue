<template>
  <v-row class="main-row no-gutters" v-if="props.tool">
    <v-col cols="12">
      <sp-stage :target="referential">
        <rect :x="0" :y="0" :width="tool.slots * SLOT_SIZE" :height="RACK_HEIGHT" fill="white" />
        <sp-stage-draggable v-for="control in controls" :target="control" :sx="5" :sy="5" capture>
          <sp-control-wrapper :synthesizer :module :dragged :dropped="dragged" :control="(control as unknown as ModControl)" no-events />
        </sp-stage-draggable>
      </sp-stage>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { RACK_HEIGHT, SLOT_SIZE } from '~/utils/constants';
import type { Control, ModControl } from '~/types/tools/Control';
import type { ScaledCoordinates } from '~/types/utils/Coordinates';
import type { PlacedBox } from '~/types/utils/PlacedBox';
import { createEmptyModule } from '~/utils/factories/modules';
import type { Tool } from '~~/types/tools/Tool';

const props = defineProps({
  tool: { type: Object as PropType<Tool>, required: true },
  creationMode: { type: Boolean, default: false },
});

const referential: Ref<ScaledCoordinates> = ref({ x: 100, y: 100, scale: 1 });
const synthesizer = createEmptySynthesizer();
const module = createEmptyModule(props.tool);

useCoordinates().setReference(referential.value)

const dragged = () => { }

type PlacedControl = ModControl & PlacedBox

const controls: Ref<PlacedControl[]> = ref([]);

props.tool.controls.forEach((c: Control) => {
  if (!validPayload(c)) return;
  const val = {
    ...c,
    module,
    x: +c?.payload?.x || 0,
    y: +c?.payload?.y || 0,
    width: 0,
    height: 0,
    id: c.id
  }
  controls.value.push(val);
})

function validPayload(control: Control) {
  return control.payload.x !== undefined && control.payload.y !== undefined
}
</script>

<style scoped lang="scss">
.main-row {
  height: 100%;
  margin: 0;
  padding: 0;

  .v-col {
    margin: 0px;
    padding: 0px;
  }

}
svg {
  height: 100%;
  width: 100%;
}
</style>