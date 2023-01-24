<template>
  <v-card>
    <template v-slot:title>{{ synthesizer.name }}</template>
    <template v-slot:subtitle>{{ synthesizer.id }}</template>
    <v-card-actions>
      <v-btn :to="uri">Editer</v-btn>
      <v-btn @click="remove(synthesizer)">Supprimer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import ISynthesizer from '~~/lib/interfaces/ISynthesizer';
import { PropType } from 'vue';
import { api } from '~~/lib/api/Api';

export default {
  props: {
    synthesizer: {
      type: Object as PropType<ISynthesizer>,
      required: true,
    }
  },
  computed: {
    uri() {
      return `/synthesizers/${this.synthesizer.id}`
    }
  },
  methods: {
    async remove(synthesizer: ISynthesizer) {
      await api.auth_delete(`/synthesizers/${synthesizer.id}`);
      useSynthesizersList().fetch();
    }
  }
}
</script>