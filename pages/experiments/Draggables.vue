<template>
  <v-app>
    <sp-stage :target="coords" mode="html">
      <sp-stage-html-layer>
        <sp-stage-draggable v-for="target in targets" :target="target" :sx="10" :sy="10" @moved="saveItem" @dropped="saveItem">
          <div :style="{ height: target.height + 'px', width: target.width + 'px', backgroundColor: 'black'}"></div>
        </sp-stage-draggable>
      </sp-stage-html-layer>

      <sp-stage-svg-layer>
        <sp-stage-draggable v-for="target in svgTargets" :target="target" :collides-with="targets">
          <rect :width="target.width" :height="target.height" fill="white" />
        </sp-stage-draggable>
      </sp-stage-svg-layer>
    </sp-stage>
  </v-app>
</template>

<script setup lang="ts">
import type { ScaledCoordinates } from '~/types/utils/Coordinates';
import type { PlacedBox } from '~/types/utils/PlacedBox';

definePageMeta({ layout: false });

const coords: Ref<ScaledCoordinates> = ref({ x: 0, y: 0, scale: 1.0 });

type FakeModule = PlacedBox & { label: string }

const targets: Ref<FakeModule[]> = ref([
  { x: 50, y: 50, height: 100, width: 100, id: '1', label: 'foo' },
  { x: 200, y: 200, height: 100, width: 100, id: '2', label: 'bar' },
]);

const svgTargets: Ref<FakeModule[]> = ref([
  { x: 50, y: 200, height: 100, width: 100, id: '3', label: 'foo' },
]);

function saveItem(item: FakeModule) {
  console.log(item)
}

function saveStage() {

}
</script>