<template>
  <v-container>
    <template v-if="groups">
      <v-row>
        <v-col cols="12">
          <GroupCreator v-if="hasRight('groups::write')" @submitted="add" />
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
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GroupCreator from "~~/components/admin/dialogs/GroupCreator.vue"
import IGroup from '~~/lib/interfaces/permissions/IGroup';
import { repositories } from '~~/lib/repositories';

const headers = useHeaders(useI18n, [
  { 'title': 'common.uuid', key: 'id' },
  { 'title': 'common.label', key: 'slug' },
  { 'title': 'common.actions' },
]);

const groups: Ref<IGroup[]> = ref(await repositories.groups.list());
const add = repositories.groups.add(groups.value);
const remove = repositories.groups.remove(groups.value);
</script>