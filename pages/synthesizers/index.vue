<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-h3 mb-4 mt-4">Votre collection</div>
        <synthesizer-creator @created="create" :floating="mobile" />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="sorted.length" cols="12" sm="6" md="4" v-for="synth in sorted">
        <synthesizer-card :synthesizer="synth" @delete="deleteSynth" />
      </v-col>
      <v-col v-else>
        <p>Vous n'avez actuellement aucun synthétiseur dans votre collection.</p>
        <p class="mt-2">Commencez par en créer un en cliquant sur le bouton en bas à droite de votre interface.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'
import { repositories } from '~~/lib/repositories';
import { remove, sortBy } from 'lodash';
import { membershipType } from '~/utils/functions/synthesizers';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import { eventbus } from '~/utils/eventbus/EventBus';

const { mobile } = useDisplay()
const synthesizers: Ref<Array<Synthesizer>> = ref([]);
repositories.synthesizers.list(useSession().token).then((list: Synthesizer[]) => {
  synthesizers.value = list;
})

// Gets the list of memberships of the current account in the correct order.
const order: Record<string, number> = { creator: 0, write: 1, read: 2 };
const name: string = useSession().username;
const sorted = computed(() => sortBy(synthesizers.value, (s: Synthesizer) => order[membershipType(s, name)]));

const deleteSynth = (id: string) => repositories.synthesizers.delete(id, useSession().token);
async function create(details: Synthesizer) {
  synthesizers.value.push(await repositories.synthesizers.create(details, useSession().token));
}

eventbus.subscribe("add.membership", async (data: Synthesizer) => {
  synthesizers.value.push(data);
});
eventbus.subscribe("remove.membership", async (data: Synthesizer) => {
  remove(synthesizers.value, { id: data.id });
})
</script>