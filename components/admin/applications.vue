<template>
  <v-row class="hidden-xs">
    <v-col xs="12" sm="8" offset-sm="2" md="6" offset-md="3">
      <div class="text-h4 my-4">Applications</div>
      <admin-creation-field @submitted="add" t="applications" />
      <v-data-table class="hidden-xs" v-if="applications" :headers="headers" :items="applications" item-value="id" />
    </v-col>
  </v-row>
  <div class="hidden-sm-and-up pt-1">
    <admin-creation-field @submitted="add" t="applications" />
    <v-list lines="one">
      <v-list-item v-for="app in applications" :key="app.id" :title="app.name" :subtitle="app.id"></v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { api } from '~~/lib/api/Api';
import IApplication from '~~/lib/interfaces/permissions/IApplication';

export default {
  data: () => ({
    applications: [] as IApplication[],
  }),
  async mounted() {
    this.applications = await api.auth_get("/applications")
  },
  computed: {
    headers() {
      return [
        {title: this.$t('common.uuid'), key: 'id'},
        {title: this.$t('common.name'), key: 'name'}
      ]
    }
  },
  methods: {
    async add(name: string) {
      this.applications.push(await api.auth_post("/applications", { name }));
    }
  }
}
</script>