<template>
  <v-dialog v-model="display" fullscreen>
    <v-card>
      <v-card-text class="text-center pt-8">
        <svg width="300" height="300">
          <circle cx="150" cy="150" r="100" fill="white" />
          <path :d="arcPath(150, 150, 110, 30, 330)" stroke-width="2" class="stroke-grey-darken-2 fill-shades-transparent"/>
          <g transform="translate(150 150)">
            <g :transform="`rotate(${angle()})`">
              <circle cx="0" cy="80" r="7" fill="blue" />
            </g>
          </g>
          <arc-circle :x="150" :y="150":r="110" :ir="5" :min="parameter?.minimum" :max="parameter?.maximum" :value="parameter?.value" />
        </svg>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import Parameter from '~~/lib/wrappers/Parameter';

const modal = useEditionModal();
let display = ref(false);
let parameter = ref<Parameter>();

function angle(): number {
  const max: number = parameter.value?.maximum || 1;
  const min: number = parameter.value?.minimum || 0;
  const val: number = parameter.value?.value || 1;

  const ratio: number = val / (max - min);
  return 30 + (300 * ratio);
}

modal.whenOpened((param: Parameter) => {
  display.value = true;
  parameter.value = param;
});
</script>

<style scoped>
svg {
  margin: 0 auto;
}
</style>