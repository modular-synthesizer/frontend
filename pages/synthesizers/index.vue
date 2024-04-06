<template>
  <v-container>
    <data-fetcher url="/synthesizers">
      <template v-slot:default="{ items: synthesizers }">
        <v-row>
          <v-col cols="12"><synthesizer-creator /></v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="text-h5">{{ $t('synthesizers.list.owned') }}</div>
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3" v-for="synth in owned(synthesizers)">
            <synthesizer-card :synthesizer="synth" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="text-h5">{{ $t('synthesizers.list.others') }}</div>
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3" v-for="synth in others(synthesizers)">
            <synthesizer-card :synthesizer="synth" />
          </v-col>
        </v-row>
      </template>
      <template v-slot:loading>
        <v-skeleton-loader type="heading" class="mb-5 mt-5" max-width="500" />
        <v-row>
          <v-col cols="4"><v-skeleton-loader type="card" /></v-col>
          <v-col cols="4"><v-skeleton-loader type="card" /></v-col>
          <v-col cols="4"><v-skeleton-loader type="card" /></v-col>
        </v-row>
      </template>
    </data-fetcher>
  </v-container>
</template>

<script lang="ts" setup>
import ISynthesizer from '~~/lib/interfaces/ISynthesizer';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

// This middleware is declared because this page does not use layout.
definePageMeta({ middleware: ['websockets'] });

const username: string = useAuthentication().session.username;

function instanciate(items: ISynthesizer[]): Synthesizer[] {
  return items.map(s => new Synthesizer(s));
}

function owned(items: ISynthesizer[]): Synthesizer[] {
    return instanciate(items).filter(s => s.isCreator(username));
}

function others(items: ISynthesizer[]): Synthesizer[] {
    return instanciate(items).filter(s => !s.isCreator(username));
}
</script>