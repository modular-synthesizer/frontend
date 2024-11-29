<template>
  <v-dialog max-width="500" v-model="useControlEdition().state.value.displayed">
    <v-card>
      <v-card-title>{{ useControlEdition().state.value.creating ? 'creation' : 'edition' }}</v-card-title>
      {{ useControlEdition().state.value.control?.id }}
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>

</script>

<style>

</style>