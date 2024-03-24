<template>
  <v-container>
    <data-fetcher url="/groups">
      <template v-slot="{ items: groups, remove, add }">
        <v-row>
          <v-col cols="12">
            <GroupCreator @submitted="add" />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12">
            <v-data-table :headers="headers" :items="groups">
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.columns.id }}</td>
                  <td>{{ item.columns.slug }}</td>
                  <td>
                    <v-btn icon small variant="plain" @click="remove(item.columns.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </template>
    </data-fetcher>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GroupCreator from "./dialogs/GroupCreator.vue"

const headers = useHeaders(useI18n, [
  { 'title': 'common.uuid', key: 'id' },
  { 'title': 'common.label', key: 'slug' },
  { 'title': 'common.actions' },
]);
</script>