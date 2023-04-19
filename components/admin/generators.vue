<template>
  <!--GeneratorCreator @submitted="save" /-->
  <v-card class="mx-auto mb-4" elevation="3" v-if="mobile" v-for="generator in generators">
    <template v-slot:title>{{ generator.name }}</template>
    <v-card-text>
      <pre>{{ generator.code }}</pre>
    </v-card-text>
  </v-card>
  <v-data-table :headers="headers" :items="generators" v-else />
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { api } from '~~/lib/api/Api';
import { IGenerator } from '~~/lib/interfaces/IGenerator';
import GeneratorCreator from './dialogs/GeneratorCreator.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

export default {
  components: { GeneratorCreator },
  computed: {
    ...mapState(useGenerators, ['generators']),
    headers(): any {
      return [
        { 'title': this.$t('common.uuid'), key: 'id' },
        { 'title': this.$t('common.name'), key: 'name' },
        { 'title': 'code', key: 'code' },
      ]
    },
    mobile() {
      return useDisplay().smAndDown.value;
    }
  },
  methods: {
    save(generator: IGenerator) {
      api.auth_post("/generators", generator).then((response: IGenerator) => {
        useGenerators().add(response);
      })
    }
  }
}
</script>

<script setup lang="ts">
useGenerators().fetchGenerators();
</script>

<style scoped>
pre {
  overflow-x: hidden;
}
</style>