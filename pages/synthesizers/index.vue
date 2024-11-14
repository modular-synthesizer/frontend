<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-h3 mb-5">Votre collection</div>
        <synthesizer-creator @created="createSynthesizer" :floating="mobile" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="synth in sorted">
        <synthesizer-card :synthesizer="synth" @delete="deleteSynthesizer" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import _, { remove } from 'lodash';
import ISynthesizer from '~~/lib/interfaces/synthesizers/ISynthesizer';
import Synth from '~~/lib/wrappers/Synthesizer';import { useDisplay } from 'vuetify'
import { repositories } from '~~/lib/repositories';

const { synthesizers: repository } = repositories;
const { mobile } = useDisplay()
const synthesizers: Ref<Synth[]> = ref(await repository.list());
const order: Record<string, number> = { creator: 0, write: 1, read: 2 };
const name: string = useAuthentication().session.username;
const sorted = computed(() => _.sortBy(synthesizers.value, (s: Synth) => order[s.membershipType(name)]));

async function deleteSynthesizer(id: string) {
  remove(synthesizers.value, { id });
  await repository.delete(id);
}

async function createSynthesizer(details: ISynthesizer) {
  synthesizers.value.push(await repository.create(details));
}
</script>