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
import _ from 'lodash';
import { api } from '~~/lib/api/Api';
import ISynth from '~~/lib/interfaces/ISynthesizer';
import Synth from '~~/lib/wrappers/Synthesizer';import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const rawList: ISynth[] = await api.auth_get("/synthesizers");
const synthesizers: Ref<Synth[]> = ref(rawList.map((details: ISynth): Synth => new Synth(details)));
const order: Record<string, number> = { creator: 0, write: 1, read: 2 };
const name: string = useAuthentication().storedSession.username;
const sorted = computed(() => _.sortBy(synthesizers.value, (s: Synth) => order[s.membershipType(name)]));

async function deleteSynthesizer(id: string) {
  const index: number = synthesizers.value.findIndex((synth: Synth) => synth.id === id);
  await api.auth_delete(`/synthesizers/${id}`)
  synthesizers.value.splice(index, 1)
}

async function createSynthesizer(details: ISynth) {
  synthesizers.value.push(new Synth(await api.auth_post("/synthesizers", details)));
}
</script>