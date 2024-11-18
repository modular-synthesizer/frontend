<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-h3 mb-5">Votre collection</div>
        <synthesizer-creator @created="create" :floating="mobile" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="synth in sorted">
        <synthesizer-card :synthesizer="synth" @delete="remove" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'
import Synthesizer from '~~/lib/wrappers/Synthesizer';
import { repositories } from '~~/lib/repositories';
import { sortBy } from 'lodash';
import ISynthesizer from '~~/lib/interfaces/synthesizers/ISynthesizer';

const { synthesizers: repository } = repositories;
const { mobile } = useDisplay()
const synthesizers: Ref<Synthesizer[]> = ref(await repository.wrap(Synthesizer));

// Gets the list of memberships of the current account in the correct order.
const order: Record<string, number> = { creator: 0, write: 1, read: 2 };
const name: string = useAuthentication().session.username;
const sorted = computed(() => sortBy(synthesizers.value, (s: ISynthesizer) => order[s.membershipType(name)]));

const remove = repositories.synthesizers.remove(synthesizers.value);
const create = repositories.synthesizers.add(synthesizers.value);
</script>