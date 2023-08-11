<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <GroupCreator @submitted="groups.create(group)" />
      </v-col>
    </v-row>
    <v-row>
      <v-col xs="12">
        <v-data-table :headers="headers" :items="groups.all()">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.columns.id }}</td>
              <td>{{ item.columns.slug }}</td>
              <td>
                <v-btn icon small variant="plain" @click="groups.delete(item.raw)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GroupCreator from "./dialogs/GroupCreator.vue"

const groups = ref(await useLists().groups);

const headers = useHeaders(useI18n, [
  { 'title': 'common.uuid', key: 'id' },
  { 'title': 'common.label', key: 'slug' },
  { 'title': 'common.actions' },
]);
</script>