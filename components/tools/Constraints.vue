<template>
  <v-tooltip>
    <template v-slot:activator="{ props }">
      <span v-bind="props">[{{ minimum }};{{ maximum}}] &#177; {{ step }} p {{ precision }}</span>
    </template>
    <div>Maximum : {{ maximum }}</div>
    <div>Miximum : {{ minimum }}</div>
    <div>Pas : {{ step }}</div>
    <div>Précision : {{ precision }}</div>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  props: {
    minimum: { type: Number },
    maximum: { type: Number },
    step: { type: Number },
    precision: { type: Number },
  }
}
</script>