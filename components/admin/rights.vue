<template>
  <template v-if="rights">
    <v-container>
      <v-row>
        <v-col xs="12" sm="8" offset-sm="2" md="6" offset-md="3">
          <SoloFieldForm v-model="right.label" @submitted="add()" />
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="12">
          <rights-table v-slot="{ right }" :rights="rights">
            <v-btn icon small variant="plain" @click="remove()">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </rights-table>
        </v-col>
      </v-row>
    </v-container>
  </template>
</template>

<script lang="ts" setup>
import type { Right } from '~/types/permissions/Right';
import SoloFieldForm from '../common/SoloFieldForm.vue';
import RightsTable from './utils/RightsTable.vue';
import { repositories } from '~~/lib/repositories';

const right: Ref<Right> = ref({ label: '', id: '' });

const { rights: repo } = repositories;
const rights: Ref<Right[]> = ref(await repo.list());
const add = () => repo.add(rights.value)(right.value);
const remove = () => repo.remove(rights.value)(right.value.id);
</script>