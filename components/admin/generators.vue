<template>
  <v-container>
    <GeneratorCreator @created="add" />
    <v-row no-gutters>
      <v-col cols="12">
        <parameter-creator @created="add" />
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-2">
      <v-col cols="12">
        <v-list>
          <v-list-item v-for="generator in generators">{{ generator }}</v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { api } from '~~/lib/api/Api';
import { useAuthentication } from '~~/lib/stores/authentication';
import { useGenerators } from '~~/lib/stores/tools/generators';
import GeneratorCreator from './dialogs/GeneratorCreator.vue'

export default {
  components: { GeneratorCreator },
  methods: {
    add(generator: any) {
      useGenerators().createGenerator(generator.name, generator.code);
    }
  }
}
</script>

<script setup lang="ts">
  const generators = await api.get('/generators', {auth_token: useAuthentication().session.token});
</script>