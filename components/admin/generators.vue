<template>
  <GeneratorCreator @submitted="save" />
  <v-data-table :headers="headers" :items="generators" />
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { api } from '~~/lib/api/Api';
import { IGenerator } from '~~/lib/interfaces/IGenerator';
import GeneratorCreator from './dialogs/GeneratorCreator.vue';

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