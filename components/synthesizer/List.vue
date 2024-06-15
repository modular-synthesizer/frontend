<template>
  <data-fetcher url="/synthesizers" :params="{ type }">
    <template v-slot:default="{ items: synthesizers }">
      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ $t(title) }}</div>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="synth in synthesizers">
          <synthesizer-card :synthesizer="instanciate(synth)" @delete="(id: string) => deleteSynthesizer(synthesizers, id)" />
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
</template>

<script lang="ts" setup>
import { api } from '~~/lib/api/Api';
import ISynthesizer from '~~/lib/interfaces/ISynthesizer';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

type Props = {
  type: string[],
  title: string,
}
const { type, title } = defineProps<Props>();

function instanciate(synth: ISynthesizer): Synthesizer {
  return new Synthesizer(synth);
}

function deleteSynthesizer(synthesizers: Synthesizer[], id: string) {
  const index: number = synthesizers.findIndex((s: Synthesizer) => s.id === id);
  if (index < 0) return;
  api.auth_delete(`/synthesizers/${id}`);
  synthesizers.splice(index, 1)
}
</script>