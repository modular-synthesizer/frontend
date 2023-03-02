<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <GroupCreator @submitted="create" />
      </v-col>
    </v-row>
    <v-row>
      <v-col xs="12">
        <v-data-table :headers="headers" :items="groups">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.columns.id }}</td>
              <td>{{ item.columns.label }}</td>
              <td>
                <v-btn icon small variant="plain" @click="remove(item.raw)">
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

<script lang="ts">
export default {
  components: { GroupCreator },
  computed: {
    ...mapState(useGroups, ['groups']),
    headers(): any {
      return [
        { 'title': this.$t('common.uuid'), key: 'id' },
        { 'title': this.$t('common.label'), key: 'label' },
        { 'title': this.$t('common.actions') },
      ]
    },
  },
  methods: {
    ...mapActions(useGroups, ['add', 'remove']),
    create(group: IGroup) {
      console.log(group);
    }
  }
}
</script>

<script setup lang="ts">
import { mapActions, mapState } from 'pinia';
import IGroup from '~~/lib/interfaces/permissions/IGroup';
import GroupCreator from './dialogs/GroupCreator.vue';
useGroups().init();
</script>