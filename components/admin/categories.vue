<template>
  <v-container class="mt-2">
    <v-row>
      <v-col xs="12" sm="8" offset-sm="2" md="6" offset-md="3">
        <form @submit.prevent="add">
          <v-text-field
            density="compact"
            variant="outlined"
            v-model="category.name"
            :label="$t('categories.labels.name')"
            append-inner-icon="mdi-plus"
            @click:append-inner="add"
            :hint="$t('categories.hints.name')"
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
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories">
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>
              <td>
                <v-btn icon size="small" variant="text" @click="remove(category.id)">
                  <v-icon>mdi-delete</v-icon>
                  </v-btn>
              </td>
            </tr>
          </tbody>
        </v-Table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { api } from '~~/lib/api/Api';
import ICategory from '~~/lib/interfaces/ICategory';
import { useAuthentication } from '~~/lib/stores/authentication';
import { remove } from "lodash"

export default {
  data: () => ({
    categories: [] as ICategory[],
    category: {
      name: ""
    }
  }),
  computed: {
    ...mapState(useAuthentication, ['session'])
  },
  mounted() {
    api.get("/categories", {auth_token: this.session.token})
      .then(categories => this.categories = categories)
  },
  methods: {
    remove(id: string) {
      api.delete(`/categories/${id}`, {auth_token: this.session.token})
        .then(() => remove(this.categories, { id }))
    },
    add() {
      const payload = {
        auth_token: this.session.token,
        name: this.category.name
      }
      api.post("/categories", payload)
        .then(response => this.categories.push(response));
    }
  }
}
</script>