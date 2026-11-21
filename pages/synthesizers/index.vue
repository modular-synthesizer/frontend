<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-h3 mb-4 mt-4">Votre collection</div>
        <synthesizer-creator @created="create" :floating="mobile" />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="status === 'loading'">
        <div class="d-flex justify-center">
          <v-progress-circular indeterminate size="64" />
        </div>
      </v-col>
      <v-col v-else-if="status === 'failed'">
        <p>Impossible de charger votre collection. Rechargez la page pour réessayer.</p>
      </v-col>
      <template v-else>
        <template v-if="sorted.length">
          <v-col cols="12" sm="6" md="4" v-for="synth in sorted">
            <synthesizer-card :synthesizer="synth" @delete="deleteSynth" />
          </v-col>
        </template>
        <v-col v-else>
          <p>Vous n'avez actuellement aucun synthétiseur dans votre collection.</p>
          <p class="mt-2">Commencez par en créer un en cliquant sur le bouton en bas à droite de votre interface.</p>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'
import { sortBy } from 'lodash';
import { membershipType } from '~/utils/functions/synthesizers';
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';
import { deleteFromList, loadList } from '~/features/synthesizers/shell/legacy/synthesizersList.adapter';
import type { ListStatus } from '~/features/synthesizers/core/data/ListStatus.type';

const { mobile } = useDisplay()
const synthesizers: Ref<Array<Synthesizer>> = ref([]);
const status: Ref<ListStatus> = ref("loading")

loadList(synthesizers, status)

// Gets the list of memberships of the current account in the correct order.
const order: Record<string, number> = { creator: 0, write: 1, read: 2 };
const name: string = useSession().username;
const sorted = computed(() => sortBy(synthesizers.value, (s: Synthesizer) => order[membershipType(s, name)]));

const deleteSynth = (id: string) => deleteFromList(synthesizers, id);

async function create(details: Synthesizer) {
  synthesizers.value.push(await api_post("/proxy/synthesizers", { name: details.name, voices: 16 }))
}
</script>