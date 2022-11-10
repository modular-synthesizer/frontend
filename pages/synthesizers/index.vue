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
          <v-col cols="3">
            <v-text-field v-model="synthesizer.name" variant="outlined" density="compact" label="Name" />
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="synthesizer.racks" type="number" variant="outlined" density="compact" label="Racks" />
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="synthesizer.slots" type="number" variant="outlined" density="compact" label="Slots" />
          </v-col>
          <v-col cols="3">
            <v-btn type="submit">Créer</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <synthesizers-list :synthesizers="synthesizers" />
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { api } from '~~/lib/api/Api';
import ISynthesizer from '~~/lib/interfaces/ISynthesizer';
import { useAuthentication } from '~~/lib/stores/authentication';

export default {
  data: () => ({
    synthesizers: [] as ISynthesizer[],
    synthesizer: {
      name: "",
      racks: 2,
      slots: 100
    }
  }),
  computed: {
    ...mapState(useAuthentication, ['session']),
  },
  methods: {
    create(synthesizer) {
      api.post('/synthesizers', {...synthesizer, auth_token: this.session.token})
        .then(response => {
          this.synthesizers.push(response)
        })
    },
  },
  mounted() {
    api.get('/synthesizers', {auth_token: this.session.token})
      .then(response => {
        this.synthesizers = response.synthesizers;
      })
  }
}
</script>