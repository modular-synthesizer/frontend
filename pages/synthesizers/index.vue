<template>
  <v-container>
    <synthesizer-creator @created="createSynthesizer" />
    <v-row>
      <v-col cols="12">
        <div class="text-h4">Votre collection</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="synth in sorted">
        <synthesizer-card :synthesizer="synth" @delete="deleteSynthesizer" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { api } from '~~/lib/api/Api';
import ISynthesizer from '~~/lib/interfaces/ISynthesizer';
import Synthesizer from '~~/lib/wrappers/Synthesizer';

const synthesizers: Ref<Synthesizer[]> = ref((await api.auth_get("/synthesizers")).map((details: ISynthesizer): Synthesizer => {
  return new Synthesizer(details)
}));

const order: Record<string, number> = { creator: 0, write: 1, read: 2 };

const name: string = useAuthentication().storedSession.username;

const sorted = computed(() => _.sortBy(synthesizers.value, (s: Synthesizer) => order[s.membershipType(name)]));

async function deleteSynthesizer(id: string) {
  const index: number = synthesizers.value.findIndex((synth: Synthesizer) => synth.id === id);
  await api.auth_delete(`/synthesizers/${id}`)
  synthesizers.value.splice(index, 1)
}

async function createSynthesizer(details: ISynthesizer) {
  const creation: ISynthesizer = await api.auth_post("/synthesizers", details);
  console.log(creation);
  synthesizers.value.push(new Synthesizer(creation));
}
</script>