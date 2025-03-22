<template>
  <v-app>
    <v-row>
      <v-col cols="6"><pre>{{ targets }}</pre></v-col>
      <v-col cols="6"><pre>{{ coords }}</pre></v-col>
    </v-row>
    <sp-stage :target="coords" mode="html">
      <sp-stage-draggable v-for="target in targets" :target="target" :sx="10" :sy="10" @dropped="saveItem">
        <v-card max-width="400">
          <v-card-title>{{ target.label }}</v-card-title>
        </v-card>
      </sp-stage-draggable>
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

function saveItem(item: PlacedBox) {
  const fullItem: FakeModule = item as FakeModule;
}

function saveStage() {

}
</script>