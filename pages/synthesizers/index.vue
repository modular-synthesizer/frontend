<template>
  <div>
    <v-form @submit.prevent="submit" class="mt-5">
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="synthesizer.name"
              variant="outlined"
              density="comfortable"
              :label="$t('synthesizers.create.labels.name')"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="synthesizer.racks"
              type="number"
              variant="outlined"
              density="comfortable"
              :label="$t('synthesizers.create.labels.racks')"
              :min="1"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="synthesizer.slots"
              type="number"
              variant="outlined"
              density="comfortable"
              :label="$t('synthesizers.create.labels.slots')"
              :min=20
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="synthesizer.voices"
              type="number"
              variant="outlined"
              density="comfortable"
              :label="$t('synthesizers.create.labels.voices')"
              :min=1
            />
          </v-col>
          <v-col cols="2">
            <v-btn type="submit" size="large">{{ $t('common.create') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-container>
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
  </div>
</template>

<script lang="ts" setup>
import Synthesizer from '~~/lib/wrappers/Synthesizer';

// This middleware is declared because this page does not use layout.
definePageMeta({ middleware: ['check-authentication', 'websockets'] });

const synthesizers = ref(await useLists().synthesizers);

function isOwned(s: Synthesizer) {
  return s.creator?.username === useAuthentication().session.username
}

const owned = computed(() => synthesizers.value.filter(isOwned))
const others = computed(() => synthesizers.value.exclude(isOwned))
const synthesizer = ref(createEmptySynthesizer());

function submit() {
  const creation: Synthesizer = new Synthesizer(synthesizer.value);
  synthesizers.value.create(creation);
}
</script>