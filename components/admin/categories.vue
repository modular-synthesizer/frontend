<template>
  <v-container class="mt-2">
    <v-row>
      <v-col xs="12" sm="8" offset-sm="2" md="6" offset-md="3">
        <form @submit.prevent="categories.create(category)">
          <v-text-field
            density="compact"
            variant="outlined"
            v-model="category.name"
            :label="$t('categories.labels.name')"
            append-inner-icon="mdi-plus"
            @click:append-inner="categories.create(category)"
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
            <tr v-for="category in categories.all()">
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>
              <td>
                <v-btn icon size="small" variant="text" @click="categories.delete(category.id)">
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

<script lang="ts" setup>
import ICategory from '~~/lib/interfaces/ICategory';

const categories = ref(await useLists().categories);
const category: Ref<ICategory> = ref({ id: "", name: "" });
</script>