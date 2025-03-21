<template>
  <v-row class="main-row no-gutters" v-if="props.tool">
    <v-col cols="12">
      <sp-stage :target="referential" @click="useSelectables().reset">
        <sp-stage-draggable v-for="control in controls" :target="control" :sx="10" :sy="10">
          <sp-control-wrapper :synthesizer :module :dragged :dropped="dragged" :control />
        </sp-stage-draggable>
      </sp-stage>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Control } from '~/types/Index';
import type { ModControl } from '~/types/tools/Control';
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

const dragged = () => { }

console.log(props.tool.controls);

const controls: (ModControl & PlacedBox)[] = props.tool.controls.map((c: Control) => ({
  ...c, x: +c.payload.x, y: +c.payload.y, width: 0, height: 0, module
}))
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