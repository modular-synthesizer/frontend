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
import { repositories } from '~~/lib/repositories';
import { sortBy } from 'lodash';
import { membershipType } from '~/utils/functions/synthesizers';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';

const { mobile } = useDisplay()
const synthesizers: Ref<Array<Synthesizer>> = ref(await repositories.synthesizers.list());

// Gets the list of memberships of the current account in the correct order.
const order: Record<string, number> = { creator: 0, write: 1, read: 2 };
const name: string = useAuthentication().username;
const sorted = computed(() => sortBy(synthesizers.value, (s: Synthesizer) => order[membershipType(s, name)]));

const remove = repositories.synthesizers.remove(synthesizers.value);
async function create(details: Synthesizer) {
  synthesizers.value.push(await repositories.synthesizers.create(details));
}
</script>