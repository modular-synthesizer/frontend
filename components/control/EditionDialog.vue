<template>
  <v-dialog max-width="500" v-model="state.displayed">
    <v-card>
      <v-card-title>{{ state.creating ? 'creation' : 'edition' }}</v-card-title>
      <v-card-text>
        <
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="state.creating">
          {{ $t('common.create') }}
        </v-btn>
        <v-btn v-else>
          {{ $t('common.save') }}
        </v-btn>
        <v-btn @click="useControlEdition().reset">
          {{ $t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ControlEditionState } from '~~/composables/controls/useControlEdition';

const state: Ref<ControlEditionState> = useControlEdition().state;
</script>

<style>

</style>