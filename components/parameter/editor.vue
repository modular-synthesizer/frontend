<template>
  <v-dialog v-model="display" fullscreen>
    <v-card>
      <v-card-text class="text-center pt-8">
        <svg width="300" height="300" ref="container">
          <circle cx="150" cy="150" r="100" class="fill-shades-black stroke-grey-darken-3" />
          <arc-circle :x="150" :y="150":r="85" :ir="5" :min="parameter?.minimum" :max="parameter?.maximum" :value="parameter?.value" />
          <text x="150" y="150" class="stroke-shades-white" text-anchor="middle" alignment-baseline="middle">
            {{ roundedValue }}
          </text>
        </svg>
        <v-text-field
          v-if="parameter"
          :min="parameter?.minimum"
          :max="parameter?.maximum"
          type="number"
          v-model="parameter.value"
          label="Valeur"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn @click="display = false">Sauvegarder et fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import Parameter from '~~/lib/wrappers/Parameter';

const modal = useEditionModal();
let display = ref(false);
let parameter = ref<Parameter>();

const container = ref<SVGSVGElement>();

const roundedValue = computed(() => {
  const power: number = 10 ** (parameter.value?.precision || 2)
  return Math.round((parameter.value?.value || 1) * 100) / 100
});

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