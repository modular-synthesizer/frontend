<template>
  <v-container>
    <v-row>
      <v-col cols="12"><synthesizer-creator /></v-col>
    </v-row>
    <v-row v-if="owned.length">
      <v-col cols="12">
        <div class="text-h5">{{ $t('synthesizers.list.owned') }}</div>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="synth in owned">
        <synthesizer-card :synthesizer="synth" />
      </v-col>
    </v-row>
    <v-row v-if="others.length">
      <v-col cols="12">
        <div class="text-h5">{{ $t('synthesizers.list.others') }}</div>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="synth in others">
        <synthesizer-card :synthesizer="synth" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import Synthesizer from '~~/lib/wrappers/Synthesizer';

// This middleware is declared because this page does not use layout.
definePageMeta({ middleware: ['websockets'] });

const synthesizers = ref(await useLists().synthesizers);

function isOwned(s: Synthesizer) {
  return s.creator?.username === useAuthentication().session.username
}

const owned = computed(() => synthesizers.value.filter(isOwned))
const others = computed(() => synthesizers.value.exclude(isOwned))
const synthesizer = ref(createEmptySynthesizer());
</script>