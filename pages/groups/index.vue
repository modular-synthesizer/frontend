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
                  <td>{{ item.id }}</td>
                  <td>{{ item.slug }}</td>
                  <td>
                    <template v-if="hasRight('groups::write')">
                      <v-btn icon size="small" variant="plain" @click="remove(item.id)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn icon size="small" variant="plain" :to="`/groups/${item.id}`">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
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
import GroupCreator from "~~/components/admin/dialogs/GroupCreator.vue"

const headers = useHeaders(useI18n, [
  { 'title': 'common.uuid', key: 'id' },
  { 'title': 'common.label', key: 'slug' },
  { 'title': 'common.actions' },
]);
</script>