<template>
  <v-card>
    <template v-slot:title>{{ synthesizer.name }}</template>
    <template v-slot:subtitle>{{ synthesizer.id }}</template>
    <v-card-actions>
      <v-btn :to="uri">Editer</v-btn>
      <deletion-dialog :url="`/synthesizers/${synthesizer.id}`" :text="`'${synthesizer.name}''`" @removed="fetchList">Supprimer</deletion-dialog>
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
    fetchList() {
      useSynthesizersList().fetch();
    }
  }
}
</script>