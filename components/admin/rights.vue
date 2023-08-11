<template>
  <v-container>
    <v-row>
      <v-col xs="12" sm="8" offset-sm="2" md="6" offset-md="3">
        <SoloFieldForm v-model="right.label" @submitted="rights.create($event)" />
      </v-col>
    </v-row>
    <v-row>
      <v-col xs="12">
        <RightsTable v-slot="{ right }" :rights="rights.all()">
          <v-btn icon small variant="plain" @click="rights.delete(right)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </RightsTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import IRight from '~~/lib/interfaces/permissions/IRight';
import SoloFieldForm from '../common/SoloFieldForm.vue';
import RightsTable from './utils/RightsTable.vue';

const rights = ref(await useLists().rights);
const right: IRight = { id: "", label: "" };
</script>