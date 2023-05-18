<template>
  <div>
    <v-form @submit.prevent="create(synthesizer)">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="text-h2">Mes synthétiseurs</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field v-model="synthesizer.name" variant="outlined" density="compact" label="Name" />
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="synthesizer.racks" type="number" variant="outlined" density="compact" label="Racks" :min="1" />
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="synthesizer.slots" type="number" variant="outlined" density="compact" label="Slots" :min=20 />
          </v-col>
          <v-col cols="3">
            <v-btn type="submit">Créer</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="synth in synthesizers">
          <synthesizer-card :synthesizer="synth" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';

definePageMeta({
  middleware: ['check-authentication'],
})
export default {
  data: () => ({
    synthesizer: createEmptySynthesizer()
  }),
  computed: {
    ...mapState(useSynthesizersList, ['synthesizers'])
  },
  methods: {
    ...mapActions(useSynthesizersList, ['create', 'fetch'])
  },
  mounted() {
    this.fetch();
  },
};
</script>