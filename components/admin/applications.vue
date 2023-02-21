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
        <v-table>
          <thead>
            <tr>
              <th>{{ $t('common.uuid') }}</th>
              <th>{{ $t('common.name') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="application in applications">
              <td>{{ application.id }}</td>
              <td>{{ application.name }}</td>
            </tr>
          </tbody>
        </v-Table>
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
  methods: {
    add() {
      api.auth_post("/applications", this.application).then((response: IApplication) => {
        this.applications.push(response)
      })
    }
  }
}
</script>