<template>

<v-container class="mt-2">
    <v-row>
      <v-col xs="12" sm="8" offset-sm="2" md="6" offset-md="3">
        <form @submit.prevent="add">
          <v-text-field
            density="compact"
            variant="outlined"
            v-model="application.name"
            :label="$t('applications.labels.name')"
            append-inner-icon="mdi-plus"
            @click:append-inner="add"
            :hint="$t('applications.hints.name')"
          />
        </form>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table v-if="applications" :headers="headers" :items="applications" item-value="id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { api } from '~~/lib/api/Api';

interface IApplication {
  id: string;
  name: string;
}

export default {
  data: () => ({
    applications: [] as IApplication[],
    application: { name: ""}
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
    add() {
      api.auth_post("/applications", this.application).then((response: IApplication) => {
        this.applications.push(response)
      })
    }
  }
}
</script>