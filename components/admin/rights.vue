<template>
  <data-fetcher url="/rights">
    <template v-slot="{ items: rights, remove, add }">
      <v-container>
        <v-row>
          <v-col xs="12" sm="8" offset-sm="2" md="6" offset-md="3">
            <SoloFieldForm v-model="right.label" @submitted="add" />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12">
            <rights-table v-slot="{ right }" :rights="rights">
              <v-btn icon small variant="plain" @click="remove(right)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </rights-table>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </data-fetcher>
</template>

<script lang="ts" setup>
import IRight from '~~/lib/interfaces/permissions/IRight';
import SoloFieldForm from '../common/SoloFieldForm.vue';
import RightsTable from './utils/RightsTable.vue';

const right: Ref<IRight> = ref({ label: '', id: '' })
</script>