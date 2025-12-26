<template>
  <v-dialog v-model="model" max-width="200">
    <template v-slot:default="{ isActive }">
      <v-card text="test text" :title="parameter?.name">
        <template v-slot:actions>
          <v-btn text="Fermer" @click="isActive.value = false" class="ml-auto" />
        </template>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useParameterEdition } from '~/composables/parameters/edition';

const { model, parameter } = useParameterEdition()
</script>